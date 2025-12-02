import express from "express";
import { json } from "express";
import { boatRouter } from "./routes/boat/router.js";
import { rentalRouter } from "./routes/rental/router.js";
import { serveWebsite } from "./routes/website-controller.js";
import handleServerErrors from "./middleware/error-handler.js";

export function createApplication() {
  return express()
    .use(json())
    .get("", serveWebsite)
    .use("/boats", boatRouter)
    .use("/rentals", rentalRouter)
    .use(handleServerErrors);
}
