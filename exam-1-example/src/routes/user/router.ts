import express from "express";
import {
  userAttributes,
  getUserById,
  addNewUser,
  getAllUsers,
} from "./service.js";
import { StatusCodes } from "http-status-codes";

export const userRouter = express
  .Router()
  .get("", (request, response) => response.send(getAllUsers(request.query)))
  .post("", async (request, response) => {
    if (!request.body) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send("Greška! Tijelo zahtjeva ne smije biti prazno.");
    }

    const invalidAttribute = userAttributes.find(
      (attribute) => typeof request.body[attribute] !== "string"
    );

    if (invalidAttribute) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send(`Greška! Nedostaje atribut ${invalidAttribute}`);
    } else if (getUserById(request.body.id)) {
      return response
        .status(StatusCodes.CONFLICT)
        .send("Korisnik s danim ID-em već postoji.");
    }

    await addNewUser({
      ime: request.body.ime,
      prezime: request.body.prezime,
    });

    response.sendStatus(StatusCodes.CREATED);
  })
  .get("/:id", (request, response) => {
    const user = getUserById(Number(request.params.id));

    if (user) {
      return response.send({
        ...user,
        message: `Uspješno dohvaćen korisnik s ID-em ${request.params.id}`,
      });
    }

    response.sendStatus(StatusCodes.NOT_FOUND);
  });
