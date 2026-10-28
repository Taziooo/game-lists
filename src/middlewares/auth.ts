import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import { pool } from "../config/mysql";

declare global {
  namespace Express { interface Request { userId?: string; } }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Token manquant" });
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE token = ?", [header.slice(7)]);
    if (rows.length === 0) return res.status(403).json({ message: "Token invalide" });
    req.userId = String(rows[0].id);
    next();
  } catch (e) { next(e); }
}
