import { Request, Response, Router } from "express";
import { body, matchedData, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PizzaOrderResponse, UserPizzaOrder } from "../../types/data-transfer-objects.js";
import { PIZZA_SIZES } from "../../types/database-types.js";
import OrderService from "./service.js";
import handleValidationResult from "../../util/validation.js";
import { ObjectId } from "mongodb";

const OrderRouter = Router()
  .post(
    "",
    body(["surname", "address", "telephoneNumber"])
      .exists()
      .withMessage((value, meta) => `Missing string ${meta.path}`),
    body("order")
      .isArray()
      .withMessage("Missing order array"),
    body("order.*.size")
      .exists()
      .withMessage("Pizza size is required")
      .isIn(PIZZA_SIZES)
      .withMessage(`Pizza size must be one of the following: ${PIZZA_SIZES.join(",")}`),
    body("order.*.id")
      .exists()
      .withMessage("Pizza ID is required")
      .custom((pizzaId) => ObjectId.isValid(pizzaId))
      .withMessage("Pizza ID isn't of valid format"),
    body("order.*.count")
      .exists()
      .withMessage("Pizza count is required")
      .isInt({min: 1})
      .withMessage("Pizza count must be an integer, at least 1"),
    handleValidationResult,
    async (request: Request, response: Response<PizzaOrderResponse>) => {
      const userOrder = matchedData<UserPizzaOrder>(request);
      const pizzaOrder = await OrderService.addOrder(userOrder);

      response.status(StatusCodes.CREATED).send(pizzaOrder);
    }
  )
  .use("/:id",
    param("id")
      .exists()
      .withMessage("ID is a required parameter")
      .custom((input) => ObjectId.isValid(input))
      .withMessage("Invalid order ID"),
    handleValidationResult,
    Router({ mergeParams: true })
      .get("/:id",
        async (request: Request, response: Response): Promise<any> =>
          response.send(await OrderService.getOrderById(matchedData(request).id))
      ));

export default OrderRouter;
