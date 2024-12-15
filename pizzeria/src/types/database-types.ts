import { UserPizzaOrder } from "./data-transfer-objects.js";

export type Pizza = {
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
};

export const PIZZA_SIZES = ["small", "medium", "jumbo"] as const;

export type PizzaSize = (typeof PIZZA_SIZES)[number];

export type PizzaOrder = UserPizzaOrder & {
  totalPrice: number;
};
