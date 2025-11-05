import { Request, Response, Router } from 'express';
import handleValidationResult from '../middleware/validation.js';
import database, { randomId } from '../database/database.js';
import { body, matchedData, param, query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { Actor } from '../types/database-types.js';
import { actorExists } from '../middleware/search.js';

const createValidationChain = () => [
  body('name')
    .isString()
    .withMessage('Name must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .bail()
    .escape(),
  body('birthYear')
    .isInt({ min: 1800 })
    .withMessage(`Birth year must be at least 1800.`)
    .trim()
    .notEmpty()
    .withMessage('Birth year is required.'),
  body('movies').isArray().withMessage('Movies must be an array of IDs.'),
  body('movies.*').isInt().withMessage('Movie ID must be a number.'),
];

const ActorRouter = Router()
  .get(
    '',
    query('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name mustn't be empty")
      .bail()
      .toLowerCase(),
    (request: Request, response: Response): any => {
      const { name } = matchedData(request);

      if (name) {
        return response.send(
          database.actors.filter((actor) => actor.name.toLowerCase().includes(name))
        );
      }

      response.send(database.actors);
    }
  )
  .get(
    '/:id',
    param('id').isInt().toInt().withMessage("ID isn't an integer"),
    handleValidationResult,
    actorExists,
    (_request: Request, response: Response): any => response.send(response.locals.actor)
  )
  .post(
    '/',
    createValidationChain(),
    handleValidationResult,
    (request: Request, response: Response) => {
      const actor: Actor = matchedData(request);
      actor.id = randomId();

      database.actors.push(actor);

      response.status(StatusCodes.CREATED).send(actor.id);
    }
  )
  .patch(
    '/:id',
    param('id').isInt().toInt().withMessage("ID isn't an integer"),
    createValidationChain().map((chain) => chain.optional()),
    handleValidationResult,
    actorExists,
    (request: Request, response: Response): any => {
      const { id, ...updatedActor }: { id: number; updatedActor: Partial<Actor> } =
        matchedData(request);

      Object.assign(response.locals.actor, updatedActor);
      response.sendStatus(StatusCodes.OK);
    }
  );

export default ActorRouter;
