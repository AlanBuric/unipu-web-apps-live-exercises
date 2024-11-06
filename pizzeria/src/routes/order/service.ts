import {randomUUID, UUID} from "crypto";
import {StatusCodes} from "http-status-codes";
import {PizzaOrder} from "../../types/types.js";
import RequestError from "../../util/RequestError.js";
import {UserPizzaOrder} from "../../types/data-transfer-objects.js";
import PizzaService from "../pizza/service.js";

const orders: Record<UUID, PizzaOrder> = {};

export default class OrderService {
    static addOrder(userOrder: UserPizzaOrder): UUID {
        const id = randomUUID();

        const ukupna_cijena = userOrder.narudzba.reduce(
            (acc: number, pizza) =>
                acc + pizza.kolicina * PizzaService.getPizzaById(pizza.id).cijena,
            0
        );

        orders[id] = {
            ...userOrder,
            ukupna_cijena
        };

        return id;
    }

    public static getOrderById(id: UUID): PizzaOrder {
        const order = orders[id];

        if (!order) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Ne postoji narudžba s ID-jem ${id}`);
        }

        return order;
    }

    public static deleteOrderById(id: UUID) {
        if (!delete orders[id]) {
            throw new RequestError(StatusCodes.NOT_FOUND, `Narudžba s ID-jem ${id} ne postoji`);
        }

        return true;
    }
}
