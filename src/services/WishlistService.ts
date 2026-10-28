import { getDb } from "../config/mongo";
import { HttpError } from "../utils/errors";
import { assertGameExists } from "./GameService";
import { Pagination, paginated } from "../utils/pagination";

export interface WishlistGame { gameId: string; addedAt: Date; note?: string; noteUpdatedAt?: Date; }
export interface Wishlist { userId: string; games: WishlistGame[]; createdAt: Date; updatedAt: Date; }

const col = () => getDb().collection<Wishlist>("wishlists");

export class WishlistService {
  static async add(userId: string, gameId: string, note?: string) {
    await assertGameExists(gameId);
    const now = new Date();
    const item: WishlistGame = { gameId, addedAt: now, ...(note ? { note, noteUpdatedAt: now } : {}) };
    try {
      const res = await col().updateOne(
        { userId, "games.gameId": { $ne: gameId } },
        { $push: { games: item }, $set: { updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true });
      if (res.matchedCount === 0 && res.upsertedCount === 0) throw new Error("dup");
    } catch (e: any) {
      if (e.code === 11000 || e.message === "dup") throw new HttpError(409, "Ce jeu est déjà dans votre wishlist");
      throw e;
    }
    return item;
  }

  static async list(userId: string, p: Pagination) {
    const [doc] = await col().aggregate<{ total: number; games: WishlistGame[] }>([
      { $match: { userId } },
      { $project: { _id: 0, total: { $size: "$games" },
          games: { $slice: [{ $sortArray: { input: "$games", sortBy: { addedAt: -1 } } }, p.offset, p.limit] } } },
    ]).toArray();
    return paginated(doc?.games ?? [], doc?.total ?? 0, p);
  }

  static async setNote(userId: string, gameId: string, note: unknown) {
    if (typeof note !== "string") throw new HttpError(400, "Le champ 'note' (texte) est requis");
    if (note.length > 1000) throw new HttpError(400, "Note limitée à 1000 caractères");
    const now = new Date();
    const res = await col().findOneAndUpdate(
      { userId, "games.gameId": gameId },
      { $set: { "games.$.note": note, "games.$.noteUpdatedAt": now, updatedAt: now } },
      { returnDocument: "after" });
    if (!res) throw new HttpError(404, "Ce jeu n'est pas dans votre wishlist");
    return res.games.find((g) => g.gameId === gameId);
  }

  static async remove(userId: string, gameId: string) {
    const res = await col().updateOne(
      { userId, "games.gameId": gameId },
      { $pull: { games: { gameId } }, $set: { updatedAt: new Date() } });
    if (res.modifiedCount === 0) throw new HttpError(404, "Ce jeu n'est pas dans votre wishlist");
  }
}
