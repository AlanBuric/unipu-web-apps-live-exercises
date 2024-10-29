import express, { json, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import RequestError from "./util/RequestError.js";
import PizzaService from "./service/pizza.js";
import OrderService from "./service/order.js";
import { PIZZA_SIZES, PizzaOrder } from "./types/types.js";
import { UserPizzaOrder } from "./types/data-transfer-objects.js";

const port = 3000;
const app = express().use(json());

app
  .get("/pizza", (request: Request, response: Response): any =>
    response.send(PizzaService.getPizzas())
  )
  .get("/pizza/:id", (request: Request, response: Response): any =>
    response.send(PizzaService.getPizzaById(request.params.id))
  )
  .get("/sizes", (request: Request, response: Response): any =>
    response.send(PIZZA_SIZES)
  )
  .post("/order", (request: Request, response: Response) => {
    const userOrder = request.body as UserPizzaOrder;
    console.log(userOrder);

    if (!userOrder) {
      throw new RequestError(StatusCodes.BAD_REQUEST, "Missing request body.");
    } else if (
      !userOrder.prezime ||
      !userOrder.adresa ||
      !userOrder.broj_telefona
    ) {
      throw new RequestError(
        StatusCodes.BAD_REQUEST,
        "Missing prezime, adresa or broj_telefona"
      );
    } else if (!userOrder.narudzba?.length) {
      throw new RequestError(StatusCodes.BAD_REQUEST, "Missing narudzba array");
    }

    let pizzas = userOrder.narudzba
      .map((order) => {
        if (!PIZZA_SIZES.includes(order.velicina)) {
          throw new RequestError(
            StatusCodes.BAD_REQUEST,
            `Unknown velicina "${
              order.velicina
            }", available ones are: ${PIZZA_SIZES.join(", ")}`
          );
        }

        return `${PizzaService.getPizzaById(order.id).naziv} ${order.velicina}`;
      })
      .join(", ");
    let index = pizzas.lastIndexOf(",");
    pizzas = pizzas.substring(0, index) + " i" + pizzas.substring(index + 1);

    const ukupna_cijena = userOrder.narudzba.reduce(
      (acc: number, pizza) =>
        acc + pizza.kolicina * PizzaService.getPizzaById(pizza.id).cijena,
      0
    );

    const order: PizzaOrder = { ...userOrder, ukupna_cijena };

    OrderService.addOrder(order);

    response.status(StatusCodes.OK).send({
      ...order,
      message: `Vaša narudžba za ${pizzas} je uspješno zaprimljena!`,
    });
  })
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

app.listen(port, () =>
  console.log(`Express server is up and running on http://localhost:${port}`)
);
