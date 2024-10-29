import { PizzaOrder } from "../types/types";

const orders: PizzaOrder[] = [];

export default class OrderService {
  static addOrder(order: PizzaOrder) {
    orders.push(order);
  }
}
