import express, { Request, Response, Router } from "express";
import { Proizvod } from "../types/types.js";
import { randomUUID, UUID } from "crypto";
import { matchedData, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import RequestError from "../util/RequestError.js";
import processValidation from "../util/validation.js";

const proizvodi: Record<UUID, Proizvod> = {};

dodajNoviProizvod({
  naziv: "Obična crna majica",
  cijena: 100,
  velicine: ["XS", "S", "M", "L"],
});

dodajNoviProizvod({
  naziv: "Levi's 501 traperice",
  cijena: 110,
  velicine: ["S", "M", "L"],
});

dodajNoviProizvod({
  naziv: "Zimska kapa",
  cijena: 40,
  velicine: ["onesize"],
});

dodajNoviProizvod({
  naziv: "Čarape Adidas",
  cijena: 20,
  velicine: ["34-36", "37-39", "40-42"],
});

dodajNoviProizvod({
  naziv: "Tenisice Nike",
  cijena: 200,
  velicine: ["38", "39", "40", "41", "42"],
});

export function dodajNoviProizvod(proizvod: Proizvod): UUID {
  const id = randomUUID();
  proizvodi[id] = proizvod;

  return id;
}

export function getProizvod(id: UUID): Proizvod {
  const proizvod = proizvodi[id];

  if (!proizvod) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      `Proizvod s ID-em ${id} ne postoji`
    );
  }

  return proizvod;
}

const ProizvodRouter = Router()
  .get("", (request: Request, response: Response): any =>
    response.send(
      Object.entries(proizvodi).map(([id, proizvod]) => ({
        id,
        ...proizvod,
      }))
    )
  )
  .get(
    "/:id",
    param("id").isUUID().withMessage("ID nije validni UUID"),
    processValidation,
    (request: Request, response: Response): any => {
      const { id } = matchedData(request);
      const proizvod = proizvodi[id];

      if (!proizvod) {
        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      response.send(proizvod);
    }
  );

export default ProizvodRouter;
