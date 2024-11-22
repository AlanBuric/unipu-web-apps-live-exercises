import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ErrorResponse } from "../../types/data-transfer-objects.js";
import RequestError from "../../util/RequestError.js";

export default function handleServerError(
  error: any,
  request: Request,
  response: Response<ErrorResponse>,
  next: NextFunction
): any {
  if (error instanceof RequestError) {
    return response.status(error.statusCode).send({ error: error.message });
  }

  console.error("An error was caught in the Express routes:", error);
  response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}