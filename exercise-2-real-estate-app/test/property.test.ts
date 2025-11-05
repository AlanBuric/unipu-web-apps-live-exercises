import {describe, it, expect} from "vitest";
import request from "supertest";
import application from "../src/application.js";
import {StatusCodes} from "http-status-codes";
import PropertyService from "../src/routes/property/service.js";

const testAgent = request(application);

const propertySubmission = {
    name: "Apartment 101",
    description: "A beautiful apartment",
    price: 200000,
    location: "New York",
    numberOfRooms: 3,
    area: 75
};

describe("Property API", () => {
    beforeEach(() => {
        PropertyService.resetMock();
    });

    it("should create a new property", async () => {
        const response = await testAgent
            .post("/property")
            .send(propertySubmission)
            .expect(StatusCodes.CREATED);

        expect(response.body).toHaveProperty("id");
    });

    it("should get all properties", async () => {
        await testAgent.post("/property").send(propertySubmission).expect(StatusCodes.CREATED);

        const response = await testAgent.get("/property").expect(StatusCodes.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(1);
    });

    it("should get property by id", async () => {
        const createResponse = await testAgent
            .post("/property")
            .send(propertySubmission)
            .expect(StatusCodes.CREATED);
        const propertyId = createResponse.body.id;

        const response = await testAgent.get(`/property/${propertyId}`).expect(StatusCodes.OK);
        expect(response.body).toMatchObject(propertySubmission);
    });

    it("should update property by id", async () => {
        const createResponse = await testAgent
            .post("/property")
            .send(propertySubmission)
            .expect(StatusCodes.CREATED);
        const propertyId = createResponse.body.id;

        const propertyUpdate = {price: 210000};
        const response = await testAgent
            .patch(`/property/${propertyId}`)
            .send(propertyUpdate)
            .expect(StatusCodes.OK);

        expect(response.body.price).toBe(propertyUpdate.price);
    });


    it("should fail PUT property by id with partial data", async () => {
        const createResponse = await testAgent
            .post("/property")
            .send(propertySubmission)
            .expect(StatusCodes.CREATED);
        const propertyId = createResponse.body.id;

        const propertyUpdate = {price: 210000, name: "Apartment 002"};
        await testAgent
            .put(`/property/${propertyId}`)
            .send(propertyUpdate)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it("should delete property by id", async () => {
        const createResponse = await testAgent
            .post("/property")
            .send(propertySubmission)
            .expect(StatusCodes.CREATED);
        const propertyId = createResponse.body.id;

        await testAgent.delete(`/property/${propertyId}`).expect(StatusCodes.OK);
        await testAgent.get(`/property/${propertyId}`).expect(StatusCodes.NOT_FOUND);
    });
});
