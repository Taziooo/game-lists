import express from "express";
import favoriteRoutes from "./routes/favoriteRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use("/api/favorites", favoriteRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use(errorHandler);
export default app;
