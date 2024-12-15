import { Request, Response, Router } from "express";
import { body, matchedData, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { PizzaOrderEntry, PizzaOrderResponse, UserPizzaOrder } from "../../types/data-transfer-objects.js";
import { PIZZA_SIZES } from "../../types/database-types.js";
import OrderService from "./service.js";
import handleValidationResult from "../../util/validation.js";
import { ObjectId } from "mongodb";

function validateOrderKeys(input: Record<string, PizzaOrderEntry>) {
  Object.keys(input).forEach((pizzaId: string) => {
    if (!ObjectId.isValid(pizzaId)) {
      throw new Error(`Pizza ID ${pizzaId} is an invalid ID`);
    }
  });

  return true;
}

const OrderRouter = Router()
  .post(
    "",
    body(["surname", "address", "telephoneNumber"])
      .isString()
      .withMessage((value, meta) => `Missing string ${meta.path}`),
    body("order")
      .isObject()
      .withMessage("Missing order object")
      .custom(validateOrderKeys),
    body("order.*.size")
      .isIn(PIZZA_SIZES)
      .withMessage(
        `Unknown size, the available ones are: ${PIZZA_SIZES.join(", ")}`
      ),
    body("order.*.count")
      .isInt({ min: 1 })
      .withMessage("Pizza order pizza count needs to be an integer, at least 1")
      .toInt(),
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
