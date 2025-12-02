import path from "path";
import fileSystem from "fs/promises";
import { DatabaseSchema } from "../types/types.js";
import { styleText } from "util";
import { getDefaultDatabase } from "./default-data.js";

const DATABASE_FILE = path.resolve("./database/data.json");

let database: null | DatabaseSchema = null;

export function getDatabase(): DatabaseSchema {
  if (!database) {
    throw new Error("Baza podataka nije učitana.");
  }

  return database;
}

export async function loadDatabase() {
  console.info(styleText(["blueBright"], "🛈 Loading the file database..."));

  try {
    const text = await fileSystem.readFile(DATABASE_FILE, {
      encoding: "utf-8",
      flag: "r",
    });

    database = JSON.parse(text);
    console.info(styleText(["green"], "✓ Database loaded successfully."));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.info(
        styleText(
          ["yellow"],
          "⚠︎ Database file not found. Creating a new one with default data..."
        )
      );

      database = getDefaultDatabase();
      await saveDatabase();

      console.info(styleText(["green"], "✓ Database created successfully."));
    } else {
      throw error;
    }
  }
}

export async function saveDatabase() {
  const dir = path.dirname(DATABASE_FILE);

  await fileSystem.mkdir(dir, { recursive: true });
  await fileSystem.writeFile(DATABASE_FILE, JSON.stringify(database, null, 2));
}
