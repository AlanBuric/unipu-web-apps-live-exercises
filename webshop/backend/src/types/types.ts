import { UUID } from "crypto";

export type PojedinaNarudzba = {
    idProizvoda: UUID;
    kolicina: number;
    velicina: string;
}

export type Narudzba = {
    naruceniProizvodi: PojedinaNarudzba[];
    ukupnaCijena: number;
}

export type Proizvod = {
    naziv: string;
    cijena: number;
    velicine: string[];
}