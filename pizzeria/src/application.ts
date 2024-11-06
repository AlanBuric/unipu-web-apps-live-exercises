import express, { json, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrderRouter from "./routes/order/router.js";
import PizzaRouter from "./routes/pizza/router.js";
import RequestError from "./util/RequestError.js";

const application = express()
  .use(json())
  .use("/pizza", PizzaRouter)
  .use("/order", OrderRouter)
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

      console.error("An error was caught in the Express routes:", error);
      response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  );

export default application;
