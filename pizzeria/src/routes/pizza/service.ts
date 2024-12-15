import { StatusCodes } from "http-status-codes";
import RequestError from "../../util/RequestError.js";
import { Pizza } from "../../types/database-types.js";
import getDatabase from "../../database/main.js";
import { Filter, InsertOneResult, MongoServerError, ObjectId } from "mongodb";

function throwNotFoundError(id: string) {
  throw new RequestError(StatusCodes.NOT_FOUND, `Pizza with ID ${id} not found.`);
}

export default class PizzaService {
  static async getPizzaById(id: string) {
    const pizza = await getDatabase().collection<Pizza>("pizzas").findOne({ _id: new ObjectId(id) });

    if (pizza) {
      return pizza;
    }

    throwNotFoundError(id);
  }

  static async deletePizzaById(id: string) {
    const result = await getDatabase().collection<Pizza>("pizzas").deleteOne({ _id: new ObjectId(id) });

    if (!result.acknowledged || result.deletedCount === 0) {
      throwNotFoundError(id);
    }
  }

  static async editPizzaById(id: string, data: Partial<Pizza>) {
    const result = await getDatabase().collection<Pizza>("pizzas").updateOne({ _id: new ObjectId(id) }, { $set: data });

    if (!result.acknowledged || result.modifiedCount === 0) {
      throwNotFoundError(id);
    }
  }

  static getPizzas({ name, ingredients }: { name?: string; ingredients?: string[] }) {
    const query: Filter<Pizza> = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (ingredients?.length) {
      query.ingredients = { $all: ingredients };
    }

    return getDatabase().collection<Pizza>("pizzas").find(query).toArray();
  }

  static async createPizza(pizza: Pizza) {
    let result: InsertOneResult<Pizza>;

    try {
      result = await getDatabase().collection<Pizza>("pizzas").insertOne(pizza);
    } catch (error) {
      if (error instanceof MongoServerError) {
        throw new RequestError(StatusCodes.BAD_REQUEST, "Duplicate pizza name");
      } else {
        throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }

    if (!result.acknowledged) {
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Pizza could not be created");
    }

    return result.insertedId;
  }
}
