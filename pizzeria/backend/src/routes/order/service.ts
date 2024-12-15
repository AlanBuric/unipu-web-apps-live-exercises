import { StatusCodes } from "http-status-codes";
import { Pizza, PizzaOrder } from "../../types/database-types.js";
import RequestError from "../../util/RequestError.js";
import { PizzaOrderResponse, UserPizzaOrder } from "../../types/data-transfer-objects.js";
import getDatabase from "../../database/main.js";
import { ObjectId } from "mongodb";

export default class OrderService {
  static async addOrder(userOrder: UserPizzaOrder): Promise<PizzaOrderResponse> {
    const pizzaIds = Object.keys(userOrder.order).map(id => new ObjectId(id));
    const pizzas = await getDatabase().collection<Pizza>("pizzas").find({ _id: { $in: pizzaIds } }).project({
      _id: 1,
      price: 1
    }).toArray();

    if (pizzas.length < pizzaIds.length) {
      const requestedIds = pizzaIds.map(objectId => objectId.toString());
      const receivedIds = new Set(pizzas.map(pizza => pizza._id.toString()));
      const missingIds = [...new Set(requestedIds).difference(receivedIds)].join(", ");

      throw new RequestError(StatusCodes.NOT_FOUND, `Pizzas with the following IDs couldn't be found: ${missingIds}`);
    }

    const totalPrice = pizzas.reduce(
      (total, pizza) => total + userOrder.order[pizza._id.toString()].count * pizza.price,
      0
    );

    const newOrder: PizzaOrder = {
      ...userOrder,
      totalPrice
    };

    const result = await getDatabase().collection<PizzaOrder>("orders").insertOne(newOrder);

    if (!result.acknowledged) {
      throw new RequestError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Order could not be created"
      );
    }

    return { totalPrice, id: result.insertedId.toString() };
  }

  public static async getOrderById(id: string): Promise<PizzaOrder> {
    const order = await getDatabase().collection<PizzaOrder>("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      throw new RequestError(
        StatusCodes.NOT_FOUND,
        `Order with ID ${id} doesn't exist`
      );
    }

    return order;
  }

  public static async deleteOrderById(id: string) {
    const result = await getDatabase().collection<PizzaOrder>("orders").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new RequestError(
        StatusCodes.NOT_FOUND,
        `Order with ID ${id} doesn't exist`
      );
    }
  }
}
