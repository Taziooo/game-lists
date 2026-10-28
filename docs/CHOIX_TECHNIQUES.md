# Choix techniques : SQL (favoris) vs NoSQL (wishlist)

## 1. Favoris → MySQL

**Pourquoi un modèle relationnel ?**
- **Unicité stricte** : la contrainte `UNIQUE KEY unique_favorite (user_id, game_id)` est appliquée par le moteur lui-même. Même si deux requêtes identiques arrivent en même temps, la seconde échoue (`ER_DUP_ENTRY`, renvoyé en **409 Conflict**). Aucun code applicatif ne peut « oublier » cette règle.
- **Relations et intégrité** : les clés étrangères vers `users` et `games` empêchent d'avoir un favori qui pointe vers un jeu ou un utilisateur inexistant. `ON DELETE CASCADE` nettoie les favoris si un jeu est supprimé.
- **Statistiques** : les favoris sont des données très structurées (qui, quoi, quand). Les `JOIN`, `GROUP BY` et `COUNT` donnent facilement les stats (`/api/favorites/stats` : total, répartition par genre, top 5 global).
- **Pagination efficace** : `LIMIT ? OFFSET ?` + l'index `idx_user (user_id)` rendent la lecture de la liste d'un utilisateur rapide, même avec beaucoup de lignes.

## 2. Wishlist → MongoDB

**Pourquoi un modèle document ?**
- **Flexibilité** : chaque jeu de la wishlist peut porter une note personnelle… ou pas. Demain on pourra ajouter une priorité, un prix cible, des tags, sans `ALTER TABLE` ni migration : le document évolue librement.
- **Un document = la wishlist d'un utilisateur** : `{ userId, games: [...] }`. Une seule lecture ramène toute la liste, ce qui correspond exactement à l'usage (« afficher ma wishlist »).
- **Opérations atomiques sur le tableau** : `$push` avec la condition `"games.gameId": { $ne: gameId }` empêche le doublon en une seule opération, `$pull` retire, et l'opérateur positionnel `games.$.note` modifie la note du bon jeu.
- **Pagination** : faite côté serveur MongoDB avec `$sortArray` + `$slice`, sans charger tout le tableau dans Node.
- Un **validateur `$jsonSchema`** garde quand même un minimum de structure (champs obligatoires, types, note limitée à 1000 caractères).

## 3. Règles métier et où elles sont appliquées

| Règle | Favoris (MySQL) | Wishlist (MongoDB) |
|---|---|---|
| Pas de doublon | `UNIQUE (user_id, game_id)` → 409 | `$push` conditionnel + index unique `userId` → 409 |
| Le jeu doit exister | Vérification dans `games` + clé étrangère → 404 | Vérification dans `games` (MySQL) → 404 |
| Chacun gère ses listes | `userId` extrait du token (middleware `auth`), jamais pris dans l'URL ou le body | idem |
| Pagination | `?page=1&limit=10` (limit max 100) → `LIMIT/OFFSET` | `?page=1&limit=10` → `$slice` |

## 4. Limites et compromis
- La wishlist n'a pas de vraie clé étrangère : la cohérence avec `games` est vérifiée par le code à l'ajout. Si un jeu est supprimé côté MySQL, il resterait dans les wishlists (on pourrait ajouter un nettoyage).
- Un document par utilisateur est limité à 16 Mo dans MongoDB, ce qui représente des dizaines de milliers de jeux : largement suffisant pour une wishlist.
- Deux bases = deux systèmes à faire tourner et à sauvegarder. C'est le prix pour utiliser chaque outil là où il est le plus adapté.
