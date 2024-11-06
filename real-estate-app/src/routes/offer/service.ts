import {UUID} from "crypto";
import {Offer} from "../../types/types.js";
import RequestError from "../../util/RequestError.js";
import {StatusCodes} from "http-status-codes";
import {randomUUID} from "node:crypto";
import {WithUUID} from "../../types/data-transfer-objects.js";

const offers: Record<UUID, Offer> = {}

export default class OfferService {
    public static getAllOffers(): (Offer & WithUUID)[] {
        return Object.entries(offers).map(([id, offer]) => ({id: id as UUID, ...offer}));
    }

    public static getOfferById(id: UUID): Offer {
        const offer = offers[id];

        if (!offer) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Ponuda s ID-em ${id} ne postoji`);
        }

        return offer;
    }

    public static addOffer(offer: Offer) {
        const id = randomUUID();

        offers[id] = offer;

        return id;
    }

    public static deleteOfferById(id: UUID) {
        if (!delete offers[id]) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Ponuda s ID-em ${id} ne postoji`);
        }

        return true;
    }

    public static updateOfferById(id: UUID, offer: Partial<Offer>): Offer {
        return Object.assign(this.getOfferById(id), offer);
    }
}