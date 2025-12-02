import express from "express";
import { json } from "express";
import { userRouter } from "./routes/user/router.js";
import { StatusCodes } from "http-status-codes";

export function createApplication() {
  return express()
    .use(json())
    .get("", (_request, response) => response.send("Pozdrav, Alan Burić!"))
    .use("/korisnici", userRouter)
    .get("/protected", (request, response) => {
      if (request.query.api_key == process.env.API_KEY) {
        return response.send("Super secret protected content!!!");
      }

      response.status(StatusCodes.FORBIDDEN).send("Pristup nije dozvoljen.");
    });
}
