import express, { json, urlencoded } from "express";
import { StatusCodes } from "http-status-codes";
import RequestError from "./util/RequestError.js";
import PizzaService from "./service/pizza.js";
import OrderService from "./service/order.js";

const port = 3000;
const app = express()
  .use(json())
  .use(urlencoded({ extended: true }));

app
  .get("/pizza", (request, response) => response.send(PizzaService.getPizzas()))
  .get("/pizza/:id", (request, response) =>
    response.send(PizzaService.getPizzaById(request.params.id))
  )
  .get("/sizes", (request, response) =>
    response.send(PizzaService.getPizzaSizes())
  )
  .post("/order", (request, response) => {
    const userOrder = request.body;
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
      throw new RequestError(
        StatusCodes.BAD_REQUEST,
        (message = "Missing narudzba array")
      );
    }

    let pizzas = userOrder.narudzba
      .map((narudzba) => {
        if (!PizzaService.getPizzaSizes().includes(narudzba.velicina)) {
          throw new RequestError(
            StatusCodes.BAD_REQUEST,
            `Unknown velicina "${
              narudzba.velicina
            }", available ones are: ${PizzaService.getPizzaSizes().join(", ")}`
          );
        }

        return `${PizzaService.getPizzaById(narudzba.id).naziv} ${
          narudzba.velicina
        }`;
      })
      .join(", ");
    let index = pizzas.lastIndexOf(",");
    pizzas = pizzas.substring(0, index) + " i" + pizzas.substring(index + 1);

    const ukupna_cijena = userOrder.narudzba.reduce(
      (acc, pizza) =>
        acc + pizza.kolicina * PizzaService.getPizzaById(pizza.id).cijena,
      0
    );

    const order = {
      prezime: userOrder.prezime,
      adresa: userOrder.adresa,
      ukupna_cijena,
    };

    OrderService.addOrder(order);

    response.status(StatusCodes.OK).send({
      message: `Vaša narudžba za ${pizzas} je uspješno zaprimljena!`,
      ...order,
    });
  })
  .use((error, request, response, next) => {
    if (error instanceof RequestError) {
      return response.status(error.statusCode).send({ error: error.message });
    }

    console.error("An error was caught by the error handler:", error);
    response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });

app.listen(port, () =>
  console.log(`Express server is up and running on http://localhost:${port}`)
);
