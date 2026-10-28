import app from "./app";
import { testMysqlConnection } from "./config/mysql";
import { connectMongo } from "./config/mongo";

const port = Number(process.env.PORT) || 3000;

(async () => {
  await testMysqlConnection();
  await connectMongo();
  app.listen(port, () => console.log(`API sur http://localhost:${port}`));
})().catch((e) => { console.error("Démarrage impossible :", e); process.exit(1); });
