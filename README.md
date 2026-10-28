# API Favoris (MySQL) & Wishlist (MongoDB) — TypeScript / Express

## Installation
```bash
npm install
cp .env.example .env          # puis renseigner les accès
mysql -u root -p < database/mysql_schema.sql
mongosh database/mongo_schema.js
npm run dev
```

## Authentification
Chaque requête envoie `Authorization: Bearer <token>` (données de test : `token-alice`, `token-bob`).

## Endpoints
| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/favorites/:gameId` | Ajouter aux favoris |
| GET | `/api/favorites?page=1&limit=10` | Mes favoris (paginés) |
| DELETE | `/api/favorites/:gameId` | Retirer des favoris |
| GET | `/api/favorites/stats` | Statistiques |
| POST | `/api/wishlist/:gameId` | Ajouter à la wishlist (body optionnel `{ "note": "..." }`) |
| GET | `/api/wishlist?page=1&limit=10` | Ma wishlist (paginée) |
| PATCH | `/api/wishlist/:gameId` | Ajouter/modifier la note `{ "note": "..." }` |
| DELETE | `/api/wishlist/:gameId` | Retirer de la wishlist |

Codes : 201 créé, 204 supprimé, 400 requête invalide, 401/403 auth, 404 jeu introuvable, 409 doublon.

## Exemple
```bash
curl -X POST localhost:3000/api/favorites/g1 -H "Authorization: Bearer token-alice"
curl -X PATCH localhost:3000/api/wishlist/g3 -H "Authorization: Bearer token-alice" \
     -H "Content-Type: application/json" -d '{"note":"Attendre les soldes"}'
```

Choix techniques : voir `docs/CHOIX_TECHNIQUES.md`.
