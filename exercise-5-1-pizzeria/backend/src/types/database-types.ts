export type Pizza = {
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string[];
};

export const PIZZA_SIZES = ["small", "medium", "jumbo"] as const;

export type PizzaSize = (typeof PIZZA_SIZES)[number];

export type PizzaOrderEntry = {
  id: string;
  size: PizzaSize;
  count: number;
};

export type PizzaOrder = {
  order: PizzaOrderEntry[];
  surname: string;
  address: string;
  telephoneNumber: string;
  totalPrice: number;
};
