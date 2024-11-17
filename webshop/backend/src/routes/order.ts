import { Router, Request, Response } from "express";
import { Order } from "../types/database-types.js";
import { StatusCodes } from "http-status-codes";
import { body, matchedData, param } from "express-validator";
import { getProduct } from "./product.js";
import RequestError from "../util/RequestError.js";
import processValidation from "../util/validation.js";
import { OrderRequest } from "../types/data-transfer-objects.js";
import AutoIncrementer from "../util/AutoIncrementer.js";

const orders: Record<number, Order> = {};
const autoIncrement = new AutoIncrementer();

const OrderRouter = Router()
  .post(
    "",
    body("items")
      .isArray()
      .withMessage("items mora biti niz"),
    body("items.*.productId")
      .isInt()
      .withMessage("ID proizvoda nije validni cijeli broj"),
    body("items.*.amount")
      .isInt({ min: 1 })
      .withMessage("Kolicina nije pozitivni cijeli broj"),
    body("items.*.size")
      .isString()
      .withMessage("Size nije validni string"),
    body("items.*.color")
      .isString()
      .withMessage("Color nije validni string"),
    processValidation,
    (request: Request, response: Response): any => {
      const orderRequest =
        matchedData<OrderRequest>(request);

      const id = autoIncrement.getAndIncrement();
      const cost = orderRequest.items.reduce(
        (acc, current) => {
          const proizvod = getProduct(current.productId as number);

          if (!proizvod.sizes.includes(current.size)) {
            throw new RequestError(
              StatusCodes.NOT_FOUND,
              `Ne postoji velicina ${current.size} za proizvod ${proizvod.name}, dostupne velicine su: ${proizvod.sizes}`
            );
          }

          return acc + proizvod.price * current.amount;
        },
        0
      );

      const order = { ...orderRequest, cost };

      orders[id] = order;

      response.status(StatusCodes.CREATED).send({ ...order, id });
    }
  )
  .get("", (request: Request, response: Response): any =>
    response.send(Object.values(orders))
  )
  .get(
    "/:id",
    param("id")
      .isInt()
      .withMessage("ID nije validni cijeli broj"),
    processValidation,
    (request: Request, response: Response): any => {
      const { id } = matchedData(request);
      const order = orders[id];

      if (!order) {
        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      response.send(order);
    }
  );

export default OrderRouter;
