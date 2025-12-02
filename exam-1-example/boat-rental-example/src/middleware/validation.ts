import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

/**
 * Express middleware that returns the first validation error message with 400 status.
 * Use after express-validator rules in route handlers.
 */
export default function handleValidation(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array();

  response
    .status(StatusCodes.BAD_REQUEST)
    .send({ error: errorsArray[0].msg, errors: errorsArray });
}
