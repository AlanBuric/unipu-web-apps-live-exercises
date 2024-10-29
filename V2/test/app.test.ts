import { describe, it, expect } from "vitest";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { PIZZA_SIZES } from "../src/types/types.js"; // Adjust import paths as necessary
import {
  PizzaOrderResponse,
  UserPizzaOrder,
} from "../src/types/data-transfer-objects.js";
import application from "../src/application.js";

const testAgent = request(application);

describe("GET /pizza", () => {
  it("should return a list of pizzas", async () => {
    const response = await testAgent.get("/pizza");

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("GET /pizza/:id", () => {
  it("should return pizza details by id", async () => {
    const pizzaId = "2";
    const response = await testAgent.get(`/pizza/${pizzaId}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toBeDefined();
  });

  it("should return 404 if pizza not found", async () => {
    const response = await testAgent.get("/pizza/999");

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

describe("GET /sizes", () => {
  it("should return available pizza sizes", async () => {
    const response = await testAgent.get("/sizes");

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(PIZZA_SIZES);
  });
});

describe("POST /order", () => {
  it("should return 400 if the request body is missing", async () => {
    const response = await testAgent.post("/order").send({});

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      "Missing prezime, adresa or broj_telefona."
    );
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await testAgent.post("/order").send({
      narudzba: [{ id: "1", velicina: "srednja", kolicina: 1 }],
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      "Missing prezime, adresa or broj_telefona."
    );
  });

  it("should return 400 if narudzba is missing", async () => {
    const response = await testAgent.post("/order").send({
      prezime: "Doe",
      adresa: "123 Pizza St",
      broj_telefona: "123456789",
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe("Missing narudzba array");
  });

  it("should return 400 for an unknown pizza size", async () => {
    const response = await testAgent.post("/order").send({
      prezime: "Doe",
      adresa: "123 Pizza St",
      broj_telefona: "123456789",
      narudzba: [{ id: "1", velicina: "XXL", kolicina: 1 }],
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'Unknown velicina "XXL", available ones are: mala, srednja, jumbo'
    );
  });

  it("should return a success message with order details", async () => {
    const order: UserPizzaOrder = {
      narudzba: [
        {
          id: "101",
          velicina: "jumbo",
          kolicina: 1,
        },
        {
          id: "2",
          velicina: "srednja",
          kolicina: 2,
        },
      ],
      prezime: "Perić",
      adresa: "Alda Negrija 6",
      broj_telefona: "0912345678",
    };

    const response = await testAgent.post("/order").send(order);

    expect(response.status).toBe(StatusCodes.CREATED);

    const expectedResponse: PizzaOrderResponse = {
      message:
        "Vaša narudžba za Capricciosa jumbo i Slavonska srednja je uspješno zaprimljena!",
      ukupna_cijena: 32,
      ...order,
    };

    expect(response.body).toEqual(expectedResponse);
  });
});
