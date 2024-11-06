import {Router, Request, Response} from "express";
import {body, matchedData, param} from "express-validator";
import {PIZZA_SIZES} from "../../types/types.js";
import handleValidationResult from "../../util/validation.js";
import PizzaService from "./service.js";

const PizzaRouter = Router()
    .get("", (request: Request, response: Response): any => response.send(PizzaService.getPizzas()))
    .get("/sizes", (request: Request, response: Response): any => response.send(PIZZA_SIZES))
    .use("/:id",
        param("id").isInt({min: 0}).withMessage("Nepravilan ID pizze"),
        handleValidationResult,
        Router()
            .get("", (request: Request, response: Response): any =>
                response.send(PizzaService.getPizzaById(request.params.id)))
            .patch(
                "",
                body("naziv").optional().isString(),
                body("cijena").optional().isFloat({min: 0}),
                handleValidationResult,
                (request: Request, response: Response): any => {
                    const pizza = PizzaService.getPizzaById(request.params.id);
                    const data = matchedData(request);

                    Object.assign(pizza, data);

                    response.send(pizza);
                }
            ));

export default PizzaRouter;