import express, { Request, Response } from "express";
import { getRentalById, addNewRental, updateRental } from "./service.js";
import { StatusCodes } from "http-status-codes";
import { body, matchedData, param } from "express-validator";
import { Rental } from "@/types/types.js";
import handleValidation from "@/middleware/validation.js";

const validationArray = [
  body("boatId").isInt().toInt().withMessage("boatId mora biti cijeli broj."),
  body("customerName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("customerName je obavezan."),
  body("startDate").isDate().withMessage("startDate mora biti valjani datum."),
  body("endDate").isDate().withMessage("endDate mora biti valjani datum."),
];

export const rentalRouter = express
  .Router()
  .post(
    "",
    validationArray,
    handleValidation,
    async (request: Request, response: Response) => {
      const rental = matchedData<Omit<Rental, "id" | "totalPrice">>(request);

      const newRental = await addNewRental(rental);

      response.status(StatusCodes.CREATED).send(newRental);
    }
  )
  .put(
    "/:id",
    param("id").isInt().toInt(),
    validationArray,
    handleValidation,
    async (request: Request, response: Response) => {
      const update = matchedData<Partial<Omit<Rental, "id" | "totalPrice">>>(
        request,
        { locations: ["body"] }
      );
      const { id } = matchedData<{ id: number }>(request, {
        locations: ["params"],
      });

      const updatedRental = await updateRental(id, update);

      response.send(updatedRental);
    }
  );
