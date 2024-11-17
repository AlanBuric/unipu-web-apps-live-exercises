import type { Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator";
import {StatusCodes} from "http-status-codes";

export default function processValidation(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    const results = validationResult(request);
  
    if (results.isEmpty()) {
      return next();
    }
  
    const errors = results.array();
  
    response.status(StatusCodes.BAD_REQUEST).send({ error: errors[0], errors });
  }