import type { Employee } from "../types/database-types.js";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import type { UUID } from "crypto";
import fileSystem from "fs";
import path from "path";

const DATABASE_FILE_LOCATION = "./database/database.json";

type DatabaseSchema = {
  employees: Record<UUID, Employee>
};

let database: Low<DatabaseSchema> | undefined = undefined;

function getDefaultData(): DatabaseSchema {
  return {
    employees: {}
  };
}

export async function connectDatabase() {
  if (database) {
    throw new Error("Database already connected");
  }

  await fileSystem.promises.access(DATABASE_FILE_LOCATION).catch(async () => {
    const directory = path.dirname(DATABASE_FILE_LOCATION);

    await fileSystem.promises.mkdir(directory, { recursive: true });
    await fileSystem.promises.writeFile(DATABASE_FILE_LOCATION, JSON.stringify(getDefaultData()));
  });

  database = await JSONFilePreset(DATABASE_FILE_LOCATION, getDefaultData());
}

export function getDatabase(): Low<DatabaseSchema> {
  if (!database) {
    throw new Error("Database isn't connected");
  }

  return database;
}