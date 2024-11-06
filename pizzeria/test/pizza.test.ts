import request from "supertest";
import application from "../src/application.js";
import {StatusCodes} from "http-status-codes";

const testAgent = request(application);

describe("Pizza routes", () => {
    it("should retrieve all pizzas", async () => {
        const res = await testAgent.get("/pizza");

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toBeInstanceOf(Array);
    });

    it("should retrieve pizza sizes", async () => {
        const res = await testAgent.get("/pizza/sizes");
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(["mala", "srednja", "jumbo"]);
    });

    it("should retrieve a single pizza by ID", async () => {
        const pizzaId = 6;
        const res = await testAgent.get(`/pizza/${pizzaId}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("naziv", "Margherita");
    });

    it.each([
        {
            id: 2,
            body: {
                cijena: 3,
                naziv: "Vegetariana"
            },
            expected: {
                cijena: 3,
                naziv: "Vegetariana"
            }
        },
        {
            id: 101,
            body: {
                cijena: 15,
            },
            expected: {
                cijena: 15,
                naziv: "Capricciosa"
            }
        },
        {
            id: 6,
            body: {
                naziv: "Updated Margherita",
            },
            expected: {
                naziv: "Updated Margherita",
                cijena: 9
            }
        }
    ])("should PATCH /pizza/:id successfully", async ({id, body, expected}) => {
        const response = await testAgent.patch(`/pizza/${id}`).send(body);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toEqual(expected);
    })

    it("should return 404 for a non-existent pizza ID", async () => {
        const invalidPizzaId = 9999;
        const res = await testAgent.get(`/pizza/${invalidPizzaId}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("error", `Pizza with ID ${invalidPizzaId} not found.`);
    });
});
