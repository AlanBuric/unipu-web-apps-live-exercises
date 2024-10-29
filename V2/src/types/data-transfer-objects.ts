import { PizzaSize } from "./types";

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
