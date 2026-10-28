import { Router } from "express";
import { WishlistController } from "../controllers/WishlistController";
import { auth } from "../middlewares/auth";

const router = Router();
router.use(auth);
router.get("/", WishlistController.list);
router.post("/:gameId", WishlistController.add);
router.patch("/:gameId", WishlistController.setNote);
router.delete("/:gameId", WishlistController.remove);
export default router;
