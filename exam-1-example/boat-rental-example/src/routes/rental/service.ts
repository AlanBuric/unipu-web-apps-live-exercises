import { getDatabase, saveDatabase } from "@/database/database.js";
import { Rental } from "@/types/types.js";
import { getDateDeltaInDays } from "@/utils/index.js";
import RequestError from "@/utils/RequestError.js";
import { StatusCodes } from "http-status-codes";

function getNextId() {
  const database = getDatabase();

  return (database.rentals.at(-1)?.id ?? 0) + 1;
}

export async function addNewRental(rental: Omit<Rental, "id" | "totalPrice">) {
  const newStartDate = new Date(rental.startDate);
  const newEndDate = new Date(rental.endDate);

  if (newEndDate < newStartDate) {
    throw new RequestError(
      StatusCodes.BAD_REQUEST,
      "Završni datum mora biti nakon početnog."
    );
  }

  const boat = getDatabase().boats.find((b) => b.id == rental.boatId);

  if (!boat) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      "Brod nije pronađen za najam."
    );
  }

  const days = getDateDeltaInDays(newStartDate, newEndDate);

  const newRental: Rental = {
    ...rental,
    id: getNextId(),
    totalPrice: days * boat.costPerDay,
  };

  getDatabase().rentals.push(newRental);

  await saveDatabase();

  return newRental;
}

export function getRentalById(id: number) {
  return getDatabase().rentals.find((rental) => rental.id == id);
}

export async function updateRental(
  id: number,
  update: Partial<Omit<Rental, "id">>
) {
  const rental = getDatabase().rentals.find((r) => r.id == id);

  if (!rental) {
    throw new RequestError(StatusCodes.NOT_FOUND, "Najam nije pronađen.");
  }

  const newStartDate = new Date(update.startDate ?? rental.startDate);
  const newEndDate = new Date(update.endDate ?? rental.endDate);

  if (newEndDate < newStartDate) {
    throw new RequestError(
      StatusCodes.BAD_REQUEST,
      "Završni datum mora biti nakon početnog."
    );
  }

  const boat = getDatabase().boats.find((b) => b.id == rental.boatId);

  if (!boat) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      "Brod nije pronađen za najam."
    );
  }

  const days = getDateDeltaInDays(newStartDate, newEndDate);
  const totalPrice = days * boat.costPerDay;

  Object.assign(rental, update);

  rental.totalPrice = totalPrice;

  await saveDatabase();

  return rental;
}
