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

    const errorsArray = errors.array();

    response.status(StatusCodes.BAD_REQUEST).send({error: errorsArray[0].msg, errors: errorsArray});
}