import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {StatusCodes} from "http-status-codes";

export default function handleValidationResult(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const errors = validationResult(request);

    if (errors.isEmpty()) {
        return next();
    }

    const validationError = errors.array({onlyFirstError: true})[0];

    response.status(StatusCodes.BAD_REQUEST).send({error: validationError.msg});
}