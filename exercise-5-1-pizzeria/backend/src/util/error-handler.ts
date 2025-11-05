import { NextFunction, Request, Response } from "express";
import RequestError from "./RequestError.js";
import { StatusCodes } from "http-status-codes";

export default function handleServerErrors(error: any, request: Request, response: Response, next: NextFunction): any {
  if (error instanceof RequestError) {
    return response.status(error.statusCode).send(error.message);
  }

  console.error(`An error was caught in the Express route ${request.method} ${request.originalUrl}:`, error);
  response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}