import express, { json, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import orderRouter from "./routes/order/router.js";
import pizzaRouter from "./routes/pizza/router.js";
import RequestError from "./util/RequestError.js";

const application = express()
  .use(json())
  .use("/pizza", pizzaRouter)
  .use("/order", orderRouter)
  .use(
    (
      error: any,
      request: Request,
      response: Response,
      next: NextFunction
    ): any => {
      if (error instanceof RequestError) {
        return response.status(error.statusCode).send({ error: error.message });
      }

      console.error("An error was caught by the error handler:", error);
      response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  );

export default application;
