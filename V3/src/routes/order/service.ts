import { randomUUID, UUID } from "crypto";
import { StatusCodes } from "http-status-codes";
import { PizzaOrder } from "../../types/types.js";
import RequestError from "../../util/RequestError.js";

const orders: Record<UUID, PizzaOrder> = {};

export default class OrderService {
  static addOrder(order: PizzaOrder): UUID {
    const id = randomUUID();
    orders[id] = order;
    return id;
  }

  public static getOrderById(id: UUID): PizzaOrder {
    const order = orders[id];

    if (!order) {
      throw new RequestError(StatusCodes.NOT_FOUND, `Ne postoji narudžba s ID-jem ${id}`);
    }

    return order;
  }

  public static deleteOrderById(id: UUID) {
    if (!delete orders[id]) {
      throw new RequestError(StatusCodes.NOT_FOUND, `Narudžba s ID-jem ${id} ne postoji`);
    }

    return true;
  }
}
