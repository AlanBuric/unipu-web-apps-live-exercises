import { getDatabase, saveDatabase } from "../../database.js";
import { User } from "../../types/types.js";

export const userAttributes: Partial<keyof User>[] = ["ime", "prezime"];

function getNextId() {
  const database = getDatabase();

  return (database.korisnici.at(-1)?.id ?? 0) + 1;
}

interface FilterOptions {
  ime?: string;
  prezime?: string;
}

export function getAllUsers({ ime, prezime }: FilterOptions = {}): User[] {
  let users = Iterator.from(getDatabase().korisnici);

  if (ime) {
    users = users.filter((user) =>
      user.ime.toLowerCase().includes(ime.toLowerCase())
    );
  }

  if (prezime) {
    users = users.filter((user) =>
      user.prezime.toLowerCase().includes(prezime.toLowerCase())
    );
  }

  return users.toArray();
}

export async function addNewUser(user: Omit<User, "id">) {
  const newUser: User = { ...user, id: getNextId() };

  getDatabase().korisnici.push(newUser);

  await saveDatabase();

  return newUser;
}

export function getUserById(id: number) {
  return getDatabase().korisnici.find((korisnik) => korisnik.id == id);
}
