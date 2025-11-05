import request from "supertest";
import application from "../src/application.js";
import {StatusCodes} from "http-status-codes";
import OfferService from "../src/routes/offer/service.js";
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

function createOfferBody(propertyId: string) {
    return {
        propertyId,
        customerFirstName: "John",
        customerLastName: "Doe",
        offerPrice: 100000,
        customerPhone: "1-866-321-4874"
    };
}

describe("Offer API", () => {
    beforeEach(() => {
        OfferService.resetMock();
        PropertyService.resetMock();
    });

    it("should create a new offer", async () => {
        const createdPropertyResponse = await testAgent
            .post("/property")
            .send(propertySubmission);
        const offerSubmission = createOfferBody(createdPropertyResponse.body.id);

        const response = await testAgent
            .post("/offer")
            .send(offerSubmission)
            .expect(StatusCodes.CREATED);

        expect(response.body).toHaveProperty("id");
    });

    it("should get all offers", async () => {
        const createdPropertyResponse = await testAgent
            .post("/property")
            .send(propertySubmission);
        const offerSubmission = createOfferBody(createdPropertyResponse.body.id);

        await testAgent.post("/offer").send(offerSubmission).expect(StatusCodes.CREATED);

        const response = await testAgent.get("/offer").expect(StatusCodes.OK);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(1);
    });

    it("should get created offer by id", async () => {
        const createdPropertyResponse = await testAgent
            .post("/property")
            .send(propertySubmission);
        const offerSubmission = createOfferBody(createdPropertyResponse.body.id);
        offerSubmission.customerPhone = "958472342";

        const createResponse = await testAgent
            .post("/offer")
            .send(offerSubmission)
            .expect(StatusCodes.CREATED);
        const offerId = createResponse.body.id;

        const response = await testAgent.get(`/offer/${offerId}`).expect(StatusCodes.OK);

        expect(response.body).toMatchObject(offerSubmission);
    });

    it("should update offer by id", async () => {
        const createdPropertyResponse = await testAgent
            .post("/property")
            .send(propertySubmission);
        const offerSubmission = createOfferBody(createdPropertyResponse.body.id);

        const createResponse = await testAgent
            .post("/offer")
            .send(offerSubmission)
            .expect(StatusCodes.CREATED);
        const offerId = createResponse.body.id;

        const updatedOfferData = {offerPrice: 110000};
        const response = await testAgent
            .patch(`/offer/${offerId}`)
            .send(updatedOfferData)
            .expect(StatusCodes.OK);

        expect(response.body.offerPrice).toBe(updatedOfferData.offerPrice);
    });

    it("should fail PUT offer by id with partial data", async () => {
        const createdPropertyResponse = await testAgent
            .post("/property")
            .send(propertySubmission);
        const offerSubmission = createOfferBody(createdPropertyResponse.body.id);

        const createResponse = await testAgent
            .post("/offer")
            .send(offerSubmission)
            .expect(StatusCodes.CREATED);
        const offerId = createResponse.body.id;

        const updatedOfferData = {offerPrice: 110000};
        await testAgent
            .put(`/offer/${offerId}`)
            .send(updatedOfferData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it("should delete offer by id", async () => {
        const createdPropertyResponse = await testAgent
            .post("/property")
            .send(propertySubmission);
        const offerSubmission = createOfferBody(createdPropertyResponse.body.id);

        const createResponse = await testAgent
            .post("/offer")
            .send(offerSubmission)
            .expect(StatusCodes.CREATED);
        const offerId = createResponse.body.id;

        await testAgent.delete(`/offer/${offerId}`).expect(StatusCodes.OK);
        await testAgent.get(`/offer/${offerId}`).expect(StatusCodes.NOT_FOUND);
    });
});
