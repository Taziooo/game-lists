import { Request, Response, NextFunction } from "express";
import { WishlistService } from "../services/WishlistService";
import { getPagination } from "../utils/pagination";

export class WishlistController {
  static async add(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json(await WishlistService.add(req.userId!, req.params.gameId, req.body?.note)); } catch (e) { next(e); }
  }
  static async list(req: Request, res: Response, next: NextFunction) {
    try { res.json(await WishlistService.list(req.userId!, getPagination(req))); } catch (e) { next(e); }
  }
  static async setNote(req: Request, res: Response, next: NextFunction) {
    try { res.json(await WishlistService.setNote(req.userId!, req.params.gameId, req.body?.note)); } catch (e) { next(e); }
  }
  static async remove(req: Request, res: Response, next: NextFunction) {
    try { await WishlistService.remove(req.userId!, req.params.gameId); res.status(204).send(); } catch (e) { next(e); }
  }
}
