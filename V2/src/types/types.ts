import { UserPizzaOrder } from "./data-transfer-objects";

export type Pizza = {
  naziv: string;
  cijena: number;
};

export const PIZZA_SIZES = ["mala", "srednja", "jumbo"] as const;

export type PizzaSize = (typeof PIZZA_SIZES)[number];

export type PizzaOrder = UserPizzaOrder & {
  ukupna_cijena: number;
};
