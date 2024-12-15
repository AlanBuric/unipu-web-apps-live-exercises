import { PizzaOrder } from "./database-types.js";

export type UserPizzaOrder = Omit<PizzaOrder, "totalPrice">;

export type PizzaOrderResponse = {
  id: string;
  totalPrice: number;
};
