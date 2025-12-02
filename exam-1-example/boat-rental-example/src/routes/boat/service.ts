import { getDatabase, saveDatabase } from "@/database/database.js";
import { Boat } from "@/types/types.js";

function getNextId() {
  const database = getDatabase();

  return (database.boats.at(-1)?.id ?? 0) + 1;
}

export function getAllBoats(nameFilter?: string): Boat[] {
  let result = getDatabase().boats;

  if (nameFilter) {
    result = result.filter((boat) => boat.name.includes(nameFilter));
  }

  return result;
}

export async function addNewBoat(boat: Omit<Boat, "id">) {
  const newBoat: Boat = { ...boat, id: getNextId() };

  getDatabase().boats.push(newBoat);

  await saveDatabase();

  return newBoat;
}

export function getBoatById(id: number) {
  return getDatabase().boats.find((boat) => boat.id == id);
}
