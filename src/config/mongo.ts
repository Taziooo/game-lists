import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
let db: Db;

export async function connectMongo(): Promise<Db> {
  await client.connect();
  db = client.db(process.env.MONGO_DB || "games_app");
  await db.collection("wishlists").createIndex({ userId: 1 }, { unique: true });
  console.log("MongoDB connecté");
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error("MongoDB non initialisé");
  return db;
}
