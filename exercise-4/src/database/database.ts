import type { Employee } from "../types/database-types.js";
import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import type { UUID } from "crypto";

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

  database = await JSONFilePreset("../database/database.json", getDefaultData());
}

export function getDatabase(): Low<DatabaseSchema> {
  if (!database) {
    throw new Error("Database isn't connected");
  }

  return database;
}