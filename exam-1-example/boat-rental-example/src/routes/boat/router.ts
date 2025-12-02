import express from "express";
import { getBoatById, addNewBoat, getAllBoats } from "./service.js";
import { StatusCodes } from "http-status-codes";
import { body, matchedData, query } from "express-validator";
import { Boat } from "@/types/types.js";
import handleValidation from "@/middleware/validation.js";

export const boatRouter = express
  .Router()
  .get("", query("name").isString().optional(), (request, response) => {
    const { name } = matchedData<{ name?: string }>(request);

    response.send(getAllBoats(name));
  })
  .post(
    "",
    body("name").isString().withMessage("name mora biti string."),
    body("type").isString().withMessage("type mora biti string."),
    body("length")
      .isFloat({ min: 0 })
      .withMessage("length mora biti pozitivan broj."),
    body("costPerDay")
      .isFloat({ min: 0 })
      .withMessage("costPerDay mora biti pozitivan broj."),
    body("engineHorsepower")
      .isFloat({ min: 0 })
      .withMessage("engineHorsepower mora biti pozitivan broj."),
    handleValidation,
    async (request, response) => {
      const boat = matchedData<Omit<Boat, "id">>(request);

      const newBoat = await addNewBoat(boat);

      response.status(StatusCodes.CREATED).send(newBoat);
    }
  )
  .get("/:id", (request, response) => {
    const boat = getBoatById(Number(request.params.id));

    if (boat) return response.send(boat);

    response.sendStatus(StatusCodes.NOT_FOUND);
  });
