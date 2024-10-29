import { StatusCodes } from "http-status-codes";
import RequestError from "../util/RequestError.js";
import { Pizza } from "../types/types.js";

const pizzaRegistry: Record<string, Pizza> = {
  6: {
    naziv: "Margerita",
    cijena: 9,
  },
  101: {
    naziv: "Capricciosa",
    cijena: 10,
  },
  2: {
    naziv: "Slavonska",
    cijena: 11,
  },
  45: {
    naziv: "Fantazija",
    cijena: 12,
  },
};

export default class PizzaService {
  static getPizzaById(id: string) {
    const pizza = pizzaRegistry[id];

    if (pizza) {
      return pizza;
    }

    throw new RequestError(
      StatusCodes.NOT_FOUND,
      `Pizza with ID ${id} not found.`
    );
  }

  static getPizzas() {
    return Object.entries(pizzaRegistry).map(([id, pizza]) => ({
      id,
      ...pizza,
    }));
  }
}
