import {NextFunction, Request, Response} from "express";
import RequestError from "../util/RequestError.js";
import {StatusCodes} from "http-status-codes";

export default function errorHandler(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
): any {
    if (error instanceof RequestError) {
        return response.status(error.statusCode).send({error: error.message});
    }

    console.error("An error was caught in the Express routes:", error);
    response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}