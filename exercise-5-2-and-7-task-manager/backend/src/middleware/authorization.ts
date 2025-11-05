import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const handleSession = (request: Request, response: Response, next: NextFunction): any => {
  const token = request.headers.authorization?.split(' ')[1];

  if (!token) {
    return response.status(401).send('No session Bearer token provided');
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!, (error, decoded) => {
    if (!error && decoded) {
      const userId = (decoded as any)['userId'];

      if (userId) {
        response.locals.userId = userId;
        return next();
      }
    }

    response.status(StatusCodes.UNAUTHORIZED).send('Invalid session token, please login');
  });
};

export default handleSession;
