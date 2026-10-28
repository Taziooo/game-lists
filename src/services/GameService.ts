import { RowDataPacket } from "mysql2";
import { pool } from "../config/mysql";
import { HttpError } from "../utils/errors";

export async function assertGameExists(gameId: string): Promise<void> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM games WHERE id = ?", [gameId]);
  if (rows.length === 0) throw new HttpError(404, `Jeu ${gameId} introuvable`);
}
