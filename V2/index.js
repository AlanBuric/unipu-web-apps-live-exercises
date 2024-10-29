const express = require("express");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const port = 3000;
const app = express().use(express.json());

const pizze = [
  {
    id: 6,
    naziv: "Margerita",
    cijena: 9,
  },
  {
    id: 101,
    naziv: "Capricciosa",
    cijena: 10,
  },
  {
    id: 2,
    naziv: "Slavonska",
    cijena: 11,
  },
  {
    id: 45,
    naziv: "Fantazija",
    cijena: 12,
  },
];

const orders = [];
const velicine = ["mala", "srednja", "jumbo"];

function getPizza(id) {
  id = parseInt(id);

  if (isNaN(id) || id < 0) {
    return StatusCodes.BAD_REQUEST;
  }

  const pizza = pizze.find((pizza) => pizza.id == id);

  if (pizza) {
    return pizza;
  }

  return StatusCodes.NOT_FOUND;
}

app.get("/pizze", (req, res) => res.send(pizze));

app.get("/pizze/:id", (req, res) => {
  const result = getPizza(req.params.id);

  if (typeof result === "number") {
    return res.sendStatus(result);
  }

  res.send(result);
});

app.post("/naruci", (req, res) => {
  const order = req.body;
  console.log(req.body);

  const notArray = !Array.isArray(order.narudzba) || !order.narudzba.length;
  const invalid = order.narudzba.find((pizza) => {
    const invalidCount = isNaN(pizza.kolicina) || parseInt(pizza.kolicina) <= 0;
    const invalidPizza =
      typeof getPizza(pizza.id) === "number" ||
      !velicine.includes(pizza.velicina);
    console.log(getPizza(pizza.id));

    return invalidCount || invalidPizza;
  });
  console.log(invalid);
  const invalidCredentials =
    !order.prezime || !order.adresa || !order.broj_telefona;

  if (notArray) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing narudzba" });
  } else if (invalidCredentials) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing credentials" });
  }
  if (invalid) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error: "Invalid request body",
    });
  }

  orders.push(order);

  let pizze = order.narudzba
    .map((narudzba) => `${getPizza(narudzba.id).naziv} ${narudzba.velicina}`)
    .join(", ");
    let index = pizze.lastIndexOf(",");
    pizze = pizze.substring(0, index) + " i" + pizze.substring(index + 1);

  const message = `Vaša narudžba za ${pizze} je uspješno zaprimljena!`;

  res.status(StatusCodes.OK).send({
    message,
    prezime: order.prezime,
    adresa: order.adresa,
    ukupna_cijena: order.narudzba.reduce(
      (acc, pizza) => acc + pizza.kolicina * getPizza(pizza.id).cijena,
      0
    ),
  });
});

app.listen(port, () =>
  console.log(`Express server is up and running on http://localhost:${port}`)
);
