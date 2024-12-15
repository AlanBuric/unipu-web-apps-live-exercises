import { PizzaSize } from "./database-types.js";

export type PizzaOrderEntry = {
  size: PizzaSize;
  count: number;
};

export type UserPizzaOrder = {
  order: Record<string, PizzaOrderEntry>;
  surname: string;
  address: string;
  telephoneNumber: string;
};

export type PizzaOrderResponse = {
  id: string;
  totalPrice: number;
};
