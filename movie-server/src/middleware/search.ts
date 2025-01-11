import { NextFunction, Request, Response } from 'express';
import database from '../database/database.js';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export function actorExists(request: Request, response: Response, next: NextFunction): any {
  const { id } = matchedData(request);
  const actor = database.actors.find((actor) => actor.id == id);

  if (actor) {
    response.locals.actor = actor;
    return next();
  }

  response.sendStatus(StatusCodes.NOT_FOUND);
}

export function movieExists(request: Request, response: Response, next: NextFunction): any {
  const { id } = matchedData(request);
  const movie = database.movies.find((actor) => actor.id == id);

  if (movie) {
    response.locals.movie = movie;
    return next();
  }

  response.sendStatus(StatusCodes.NOT_FOUND);
}
