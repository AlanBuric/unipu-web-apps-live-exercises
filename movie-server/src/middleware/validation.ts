import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export default function handleValidationResult(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    return next();
  }

  response.status(StatusCodes.BAD_REQUEST).send({ errors: errors.array() });
}
