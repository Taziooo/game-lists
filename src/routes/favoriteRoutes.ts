import { Router } from "express";
import { FavoriteController } from "../controllers/FavoriteController";
import { auth } from "../middlewares/auth";

const router = Router();
router.use(auth);
router.get("/stats", FavoriteController.stats);
router.get("/", FavoriteController.list);
router.post("/:gameId", FavoriteController.add);
router.delete("/:gameId", FavoriteController.remove);
export default router;
