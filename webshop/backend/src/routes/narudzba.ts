import { Router, Request, Response } from "express";
import { Narudzba } from "../types/types.js";
import { randomUUID, UUID } from "crypto";
import { StatusCodes } from "http-status-codes";
import { body, matchedData, param } from "express-validator";
import { getProizvod } from "./proizvod.js";
import RequestError from "../util/RequestError.js";
import processValidation from "../util/validation.js";

const narudzbe: Record<UUID, Narudzba> = {};

const NarudzbaRouter = Router()
  .post(
    "",
    body("naruceniProizvodi")
      .isArray()
      .withMessage("naruceniProizvodi mora biti niz"),
    body("naruceniProizvodi.*.idProizvoda")
      .isUUID()
      .withMessage("ID proizvoda nije validni UUID"),
    body("naruceniProizvodi.*.kolicina")
      .isInt({ min: 1 })
      .withMessage("Kolicina nije pozitivni cijeli broj"),
    processValidation,
    (request: Request, response: Response): any => {
      const korisnickaNarudzba =
        matchedData<Omit<Narudzba, "ukupnaCijena">>(request);

      const id = randomUUID();
      const ukupnaCijena = korisnickaNarudzba.naruceniProizvodi.reduce(
        (acc, current) => {
          const proizvod = getProizvod(current.idProizvoda);

          if (!proizvod.velicine.includes(current.velicina)) {
            throw new RequestError(
              StatusCodes.NOT_FOUND,
              `Ne postoji velicina ${current.velicina} za proizvod ${proizvod.naziv}, dostupne velicine su: ${proizvod.velicine}`
            );
          }

          return acc + proizvod.cijena * current.kolicina;
        },
        0
      );

      const narudzba = { ...korisnickaNarudzba, ukupnaCijena };

      narudzbe[id] = narudzba;

      response.status(StatusCodes.CREATED).send({ ...narudzba, id });
    }
  )
  .get("", (request: Request, response: Response): any =>
    response.send(Object.values(narudzbe))
  )
  .get(
    "/:id",
    param("id").isUUID().withMessage("ID nije validni UUID"),
    processValidation,
    (request: Request, response: Response): any => {
      const { id } = matchedData(request);
      const narudzba = narudzbe[id];

      if (!narudzba) {
        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      response.send(narudzba);
    }
  );

export default NarudzbaRouter;
