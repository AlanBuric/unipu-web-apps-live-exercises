import {UUID} from "crypto";

export type Property = {
    name: string;
    description: string;
    price: number;
    location: string;
    numberOfRooms: number;
    area: number;
}

export type Offer = {
    propertyId: UUID;
    customerFirstName: string;
    customerLastName: string;
    offerPrice: number;
    customerPhone: string;
}
