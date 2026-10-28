CREATE DATABASE IF NOT EXISTS games_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE games_app;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  token VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  release_year INT
);

CREATE TABLE IF NOT EXISTS user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  game_id VARCHAR(100) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, game_id),
  INDEX idx_user (user_id),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

INSERT IGNORE INTO users (id, email, token) VALUES
  ('u1', 'alice@test.com', 'token-alice'),
  ('u2', 'bob@test.com',   'token-bob');

INSERT IGNORE INTO games (id, title, genre, release_year) VALUES
  ('g1', 'The Witcher 3', 'RPG', 2015),
  ('g2', 'Hades', 'Roguelike', 2020),
  ('g3', 'Elden Ring', 'RPG', 2022),
  ('g4', 'Celeste', 'Plateforme', 2018),
  ('g5', 'Stardew Valley', 'Simulation', 2016);
