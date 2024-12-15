import { Db, MongoClient } from "mongodb";

let database: undefined | Db;

export async function connectToDatabase(): Promise<Db> {
  const mongoUri = process.env.MONGO_URI;
  const databaseName = process.env.MONGO_DATABASE_NAME;

  if (!mongoUri) {
    throw new Error("MongoDB URI is missing");
  } else if (!databaseName) {
    throw new Error("MongoDB name is missing");
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();

    console.log("Successfully connected to MongoDB.");

    return database = client.db(databaseName);
  } catch (error) {
    console.error("An error occurred while trying to connect to the database", error);
    throw error;
  }
}

export default function getDatabase(): Db {
  if (!database) {
    throw new Error("MongoDB database was invoked while uninitialized");
  }

  return database;
}