import { getDateDeltaInDays } from "@/utils/index.js";
import { DatabaseSchema } from "../types/types.js";

export function getDefaultDatabase(): DatabaseSchema {
  return {
    boats: [
      {
        id: 1,
        name: "Neverin",
        type: "Jedrilica",
        length: 12,
        costPerDay: 250,
        engineHorsepower: 50,
      },
      {
        id: 2,
        name: "Wave Rider",
        type: "Motorni brod",
        length: 7,
        costPerDay: 200,
        engineHorsepower: 150,
      },
      {
        id: 3,
        name: "Fisherman Bellingardo",
        type: "Motorni brod",
        length: 5,
        costPerDay: 100,
        engineHorsepower: 70,
      },
    ],
    rentals: [
      {
        id: 1,
        boatId: 2,
        customerName: "Ivan Horvat",
        startDate: "2025-07-01",
        endDate: "2025-07-05",
        totalPrice:
          getDateDeltaInDays(new Date("2025-07-01"), new Date("2025-07-05")) *
          200,
      },
    ],
  };
}
