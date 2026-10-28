import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/mysql";
import { HttpError } from "../utils/errors";
import { assertGameExists } from "./GameService";
import { Pagination, paginated } from "../utils/pagination";

export class FavoriteService {
  static async add(userId: string, gameId: string) {
    await assertGameExists(gameId);
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO user_favorites (user_id, game_id) VALUES (?, ?)", [userId, gameId]);
      return { id: result.insertId, userId, gameId };
    } catch (e: any) {
      if (e.code === "ER_DUP_ENTRY") throw new HttpError(409, "Ce jeu est déjà dans vos favoris");
      throw e;
    }
  }

  static async list(userId: string, p: Pagination) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT f.id, f.game_id AS gameId, g.title, g.genre, f.added_at AS addedAt
         FROM user_favorites f JOIN games g ON g.id = f.game_id
        WHERE f.user_id = ? ORDER BY f.added_at DESC LIMIT ? OFFSET ?`,
      [userId, p.limit, p.offset]);
    const [[{ total }]] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM user_favorites WHERE user_id = ?", [userId]);
    return paginated(rows, Number(total), p);
  }

  static async remove(userId: string, gameId: string) {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM user_favorites WHERE user_id = ? AND game_id = ?", [userId, gameId]);
    if (result.affectedRows === 0) throw new HttpError(404, "Ce jeu n'est pas dans vos favoris");
  }

  static async stats(userId: string) {
    const [[summary]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total, MIN(added_at) AS firstAddedAt, MAX(added_at) AS lastAddedAt
         FROM user_favorites WHERE user_id = ?`, [userId]);
    const [byGenre] = await pool.query<RowDataPacket[]>(
      `SELECT g.genre, COUNT(*) AS count FROM user_favorites f JOIN games g ON g.id = f.game_id
        WHERE f.user_id = ? GROUP BY g.genre ORDER BY count DESC`, [userId]);
    const [topGlobal] = await pool.query<RowDataPacket[]>(
      `SELECT g.id AS gameId, g.title, COUNT(*) AS favoritesCount FROM user_favorites f
         JOIN games g ON g.id = f.game_id GROUP BY g.id, g.title ORDER BY favoritesCount DESC LIMIT 5`);
    return { total: Number(summary.total), firstAddedAt: summary.firstAddedAt, lastAddedAt: summary.lastAddedAt,
             byGenre, topGamesAllUsers: topGlobal };
  }
}
