import {Request, Response, Router} from "express";
import {body, matchedData, param} from "express-validator";
import {StatusCodes} from "http-status-codes";
import {PizzaOrderResponse, UserPizzaOrder} from "../../types/data-transfer-objects.js";
import {PIZZA_SIZES} from "../../types/types.js";
import PizzaService from "../pizza/service.js";
import OrderService from "./service.js";
import handleValidationResult from "../../util/validation.js";

const OrderRouter = Router()
    .post(
        "",
        body(["prezime", "adresa", "broj_telefona"])
            .isString()
            .withMessage((value, meta) => `Missing string ${meta.path}`),
        body("narudzba").isArray().withMessage("Missing narudzba array"),
        body("narudzba.*.velicina")
            .isIn(PIZZA_SIZES)
            .withMessage(
                `Unknown velicina, availabe ones are: ${PIZZA_SIZES.join(", ")}`
            ),
        (request: Request, response: Response<PizzaOrderResponse>) => {
            const userOrder = matchedData<UserPizzaOrder>(request);

            let pizzas = userOrder.narudzba
                .map((order) => {
                    return `${PizzaService.getPizzaById(order.id).naziv} ${
                        order.velicina
                    }`;
                })
                .join(", ");
            let index = pizzas.lastIndexOf(",");
            pizzas = pizzas.substring(0, index) + " i" + pizzas.substring(index + 1);

            const id = OrderService.addOrder(userOrder);

            response.status(StatusCodes.CREATED).send({
                ...OrderService.getOrderById(id),
                id,
                message: `Vaša narudžba za ${pizzas} je uspješno zaprimljena!`,
            });
        }
    )
    .get(
        "/:id",
        param("id").isUUID().withMessage("Nepravilan UUID parametar narudžbe"),
        handleValidationResult,
        (request: Request, response: Response): any =>
            response.send(OrderService.getOrderById(matchedData(request).id))
    )
    .delete(
        "/:id",
        param("id").isUUID().withMessage("Nepravilan UUID parametar narudžbe"),
        handleValidationResult,
        (request: Request, response: Response) => {
            response.sendStatus(OrderService.deleteOrderById(matchedData(request).id) ? StatusCodes.OK : StatusCodes.NOT_FOUND);
        }
    );

export default OrderRouter;
