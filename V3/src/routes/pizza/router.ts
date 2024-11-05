import { Router, Request, Response } from "express";
import { body, matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { UserPizzaOrder } from "../../types/data-transfer-objects.js";
import { PizzaOrder, PIZZA_SIZES } from "../../types/types.js";
import handleValidationResult from "../../util/validation.js";
import OrderService from "../order/service.js";
import PizzaService from "./service.js";

const pizzaRouter = Router()
  .get("", (request: Request, response: Response): any =>
    response.send(PizzaService.getPizzas())
  )
  .get("/:id", (request: Request, response: Response): any =>
    response.send(PizzaService.getPizzaById(request.params.id))
  )
  .patch(
    "/:id",
    body("naziv").optional().isString(),
    body("cijena").optional().isFloat({ min: 0 }),
    handleValidationResult,
    (request: Request, response: Response): any => {
      const pizza = PizzaService.getPizzaById(request.params.id);
      const data = matchedData(request);

      Object.assign(pizza, data);

      response.send(pizza);
    }
  )
  .get("/sizes", (request: Request, response: Response): any =>
    response.send(PIZZA_SIZES)
  );

export default pizzaRouter;
