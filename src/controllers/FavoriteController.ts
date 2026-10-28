import { Request, Response, NextFunction } from "express";
import { FavoriteService } from "../services/FavoriteService";
import { getPagination } from "../utils/pagination";

export class FavoriteController {
  static async add(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json(await FavoriteService.add(req.userId!, req.params.gameId)); } catch (e) { next(e); }
  }
  static async list(req: Request, res: Response, next: NextFunction) {
    try { res.json(await FavoriteService.list(req.userId!, getPagination(req))); } catch (e) { next(e); }
  }
  static async remove(req: Request, res: Response, next: NextFunction) {
    try { await FavoriteService.remove(req.userId!, req.params.gameId); res.status(204).send(); } catch (e) { next(e); }
  }
  static async stats(req: Request, res: Response, next: NextFunction) {
    try { res.json(await FavoriteService.stats(req.userId!)); } catch (e) { next(e); }
  }
}
