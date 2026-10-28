db = db.getSiblingDB("games_app");

db.createCollection("wishlists", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "games", "createdAt", "updatedAt"],
      properties: {
        userId: { bsonType: "string" },
        games: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["gameId", "addedAt"],
            properties: {
              gameId: { bsonType: "string" },
              addedAt: { bsonType: "date" },
              note: { bsonType: "string", maxLength: 1000 },
              noteUpdatedAt: { bsonType: "date" }
            }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.wishlists.createIndex({ userId: 1 }, { unique: true });

