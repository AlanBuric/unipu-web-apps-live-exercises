import {PizzaOrder, PizzaSize} from "./types.js";
import {UUID} from "crypto";

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

export type PizzaOrderResponse = PizzaOrder & {
    id: UUID,
    message: string;
};
