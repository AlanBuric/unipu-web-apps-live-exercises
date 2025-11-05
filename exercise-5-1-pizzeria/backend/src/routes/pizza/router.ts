import { Request, Response, Router } from "express";
import { body, matchedData, param, query } from "express-validator";
import { Pizza, PIZZA_SIZES } from "../../types/database-types.js";
import handleValidationResult from "../../util/validation.js";
import PizzaService from "./service.js";
import { StatusCodes } from "http-status-codes";
import { MinMaxOptions } from "express-validator/lib/options.js";
import { ObjectId } from "mongodb";

const PIZZA_NAME_LENGTH: MinMaxOptions = { min: 2, max: 48 };
const PIZZA_NAME_LENGTH_MESSAGE = `Pizza name needs to range from ${PIZZA_NAME_LENGTH.min} to ${PIZZA_NAME_LENGTH.max} characters long`;
const ARRAY_QUERY_LENGTH_LIMIT: MinMaxOptions = { min: 1, max: 10 };

const PizzaRouter = Router()
  .get("",
    query("name")
      .optional()
      .isLength(PIZZA_NAME_LENGTH)
      .withMessage(PIZZA_NAME_LENGTH_MESSAGE),
    query("ingredients")
      .optional()
      .isArray(ARRAY_QUERY_LENGTH_LIMIT)
      .withMessage(`Ingredients array needs to be between ${ARRAY_QUERY_LENGTH_LIMIT.min} and ${ARRAY_QUERY_LENGTH_LIMIT.max} elements long`),
    handleValidationResult,
    (request: Request, response: Response): any => PizzaService.getPizzas(matchedData(request))
      .then((pizzas) => response.send(pizzas)))
  .post("",
    body("name")
      .exists()
      .withMessage("Pizza name needs to be a string")
      .isLength(PIZZA_NAME_LENGTH)
      .withMessage(PIZZA_NAME_LENGTH_MESSAGE),
    body("price")
      .exists()
      .isFloat({ gt: 0 })
      .withMessage("Price needs to be a positive decimal number greater than 0")
      .toFloat(),
    body("imageUrl")
      .exists()
      .isString()
      .withMessage("Pizza image URL is a required string"),
    body("ingredients")
      .exists()
      .isArray({ min: 1 })
      .withMessage("Ingredients is a required array with at least 1 element"),
    body("ingredients.*")
      .isString()
      .withMessage("Ingredients need to be strings"),
    handleValidationResult,
    (request: Request, response: Response): Promise<any> =>
      PizzaService.createPizza(matchedData<Pizza>(request))
        .then(id => response.status(StatusCodes.CREATED).send(id))
  )
  .get("/sizes", (request: Request, response: Response): any => response.send(PIZZA_SIZES))
  .use("/:id",
    param("id")
      .exists()
      .custom((input) => ObjectId.isValid(input))
      .withMessage("Invalid pizza ID"),
    handleValidationResult,
    Router({ mergeParams: true })
      .get("", async (request: Request, response: Response): Promise<any> =>
        response.send(await PizzaService.getPizzaById(matchedData(request).id)))
      .delete("",
        async (request: Request, response: Response): Promise<any> => {
          await PizzaService.getPizzaById(matchedData(request).id);
          response.sendStatus(StatusCodes.OK);
        })
      .patch(
        "",
        body("name")
          .optional()
          .isString()
          .withMessage("Pizza name needs to be a string")
          .isLength(PIZZA_NAME_LENGTH)
          .withMessage(PIZZA_NAME_LENGTH_MESSAGE),
        body("price")
          .optional()
          .isFloat({ gt: 0 })
          .withMessage("Price needs to be a positive decimal number greater than 0")
          .toFloat(),
        body("imageUrl")
          .optional()
          .isString()
          .withMessage("Pizza image URL is a required string"),
        body("ingredients")
          .optional()
          .isArray({ min: 1 })
          .withMessage("Ingredients is a required array with at least 1 element"),
        body("ingredients.*")
          .optional()
          .isString()
          .withMessage("Ingredients need to be strings"),
        handleValidationResult,
        async (request: Request, response: Response): Promise<any> => {
          const { id, ...data } = matchedData(request);

          if (Object.keys(data).length > 0) {
            await PizzaService.editPizzaById(id, data);
          }

          return response.sendStatus(StatusCodes.OK);
        }
      ));

export default PizzaRouter;