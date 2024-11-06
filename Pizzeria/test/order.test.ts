import request from "supertest";
import {StatusCodes} from "http-status-codes";
import application from "../src/application.js";
import {PizzaOrderResponse, UserPizzaOrder} from "../src/types/data-transfer-objects.js";

const testAgent = request(application);

describe("Pizza order routes", () => {
    const newOrder: UserPizzaOrder = {
        narudzba: [
            {
                id: "101",
                velicina: "jumbo",
                kolicina: 1
            },
            {
                id: "2",
                velicina: "srednja",
                kolicina: 2
            },
        ],
        prezime: "Perić",
        adresa: "Alda Negrija 6",
        broj_telefona: "0912345678",
    };

    it("should create a new order with correct response", async () => {
        const response = await testAgent.post("/order").send(newOrder);

        expect(response.status).toBe(StatusCodes.CREATED);

        const expectedResponse: Omit<PizzaOrderResponse, "id"> = {
            message:
                "Vaša narudžba za Capricciosa jumbo i Slavonska srednja je uspješno zaprimljena!",
            ukupna_cijena: 32,
            ...newOrder,
        };

        expect(response.body).toMatchObject(expectedResponse);
    });

    it("should retrieve an order by ID", async () => {
        const {id} = (await testAgent.post("/order").send(newOrder)).body;
        const res = await testAgent.get(`/order/${id}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("prezime", "Perić");
        expect(res.body).toHaveProperty("ukupna_cijena");
    });

    it("should delete an order by ID", async () => {
        const {id} = (await testAgent.post("/order").send(newOrder)).body;
        const res = await testAgent.delete(`/order/${id}`);
        expect(res.status).toBe(StatusCodes.OK);

        const checkRes = await testAgent.get(`/order/${id}`);
        expect(checkRes.status).toBe(StatusCodes.NOT_FOUND);
        expect(checkRes.body).toHaveProperty("error", `Ne postoji narudžba s ID-jem ${id}`);
    });

    it("should return 404 for a non-existent order ID", async () => {
        const invalidOrderId = "invalid-uuid";
        const res = await testAgent.get(`/order/${invalidOrderId}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("error", `Nepravilan UUID parametar narudžbe`);
    });
});
