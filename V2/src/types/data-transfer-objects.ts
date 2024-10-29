import { PizzaSize } from "./types.js";

export type PizzaOrderEntry = {
  id: string;
  velicina: PizzaSize;
  kolicina: number;
};

export type UserPizzaOrder = {
  narudzba: PizzaOrderEntry[];
  prezime: string;
  adresa: string;
  broj_telefona: string;
};

export type PizzaOrderResponse = UserPizzaOrder & {
  ukupna_cijena: number;
  message: string;
};
