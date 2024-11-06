import { randomUUID } from "crypto";
import { Router, Request, Response } from "express";
import { body, matchedData, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { UserPizzaOrder } from "../../types/data-transfer-objects.js";
import { PizzaOrder, PIZZA_SIZES } from "../../types/types.js";
import PizzaService from "../pizza/service.js";
import OrderService from "./service.js";

const OrderRouter = Router()
  .post(
    "",
    body(["prezime", "adresa", "broj_telefona"])
      .isString()
      .withMessage((value, meta) => `Missing string ${meta.path}`),
    body("narudzba").isArray().withMessage("Missing narudzba array"),
    body("narudzba.*.velicina")
      .isIn(PIZZA_SIZES)
      .withMessage(
        `Unknown velicina, availabe ones are: ${PIZZA_SIZES.join(", ")}`
      ),
    (request: Request, response: Response) => {
      const userOrder = matchedData<UserPizzaOrder>(request);

      let pizzas = userOrder.narudzba
        .map((order) => {
          return `${PizzaService.getPizzaById(order.id).naziv} ${
            order.velicina
          }`;
        })
        .join(", ");
      let index = pizzas.lastIndexOf(",");
      pizzas = pizzas.substring(0, index) + " i" + pizzas.substring(index + 1);

      const ukupna_cijena = userOrder.narudzba.reduce(
        (acc: number, pizza) =>
          acc + pizza.kolicina * PizzaService.getPizzaById(pizza.id).cijena,
        0
      );

      const order: PizzaOrder = {
        ...userOrder,
        ukupna_cijena,
        id: randomUUID(),
      };

      OrderService.addOrder(order);

      response.status(StatusCodes.CREATED).send({
        ...order,
        message: `Vaša narudžba za ${pizzas} je uspješno zaprimljena!`,
      });
    }
  )
  .get(
    "/:id",
    param("id").isUUID().withMessage("Nepravilan UUID parametar narudžbe"),
    (request: Request, response: Response): any =>
      response.send(OrderService.getOrderById(matchedData(request).id))
  )
  .delete(
    "/:id",
    param("id").isUUID().withMessage("Nepravilan UUID parametar narudžbe"),
    (request: Request, response: Response) => {
        OrderService.deleteOrderById(matchedData(request).id);
        response.sendStatus(StatusCodes.OK);
    }
  );

export default OrderRouter;
