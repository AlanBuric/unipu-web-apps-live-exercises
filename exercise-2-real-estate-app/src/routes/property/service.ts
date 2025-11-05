import {UUID} from 'crypto';
import {Property} from '../../types/types.js';
import RequestError from '../../util/RequestError.js';
import {StatusCodes} from 'http-status-codes';
import {randomUUID} from 'node:crypto';
import {WithUUID} from '../../types/data-transfer-objects.js';

let properties: Record<UUID, Property> = {};

export default class PropertyService {
    public static getAllProperties(): (Property & WithUUID)[] {
        return Object.entries(properties).map(([id, property]) => ({id: id as UUID, ...property}));
    }

    public static getPropertyById(id: UUID): Property {
        const property = properties[id];

        if (!property) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Nekretnina s ID-em ${id} ne postoji`);
        }

        return property;
    }

    public static addProperty(property: Property): UUID {
        const id = randomUUID();

        properties[id] = property;

        return id;
    }

    public static deletePropertyById(id: UUID): boolean {
        if (!delete properties[id]) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Nekretnina s ID-em ${id} ne postoji`);
        }

        return true;
    }

    public static updatePropertyById(id: UUID, property: Partial<Property>): Property {
        const existingProperty = this.getPropertyById(id);

        return Object.assign(existingProperty, property);
    }

    public static resetMock() {
        if (process.env.NODE_ENV !== "test") {
            throw new Error("Reset mock can be called only during tests");
        }

        properties = {};
    }
}
