import { Request, Response, Router } from 'express';
import handleValidationResult from '../middleware/validation.js';
import database, { randomId } from '../database/database.js';
import { body, matchedData, param, query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { Movie } from '../types/database-types.js';
import { movieExists } from '../middleware/search.js';

const createMovieValidationChain = () => [
  body('title')
    .isString()
    .withMessage('Title must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .bail()
    .escape(),
  body('year')
    .isInt({ min: 1888 })
    .withMessage(`Year must be at least 1888.`)
    .notEmpty()
    .withMessage('Year is required.'),
  body('genre')
    .isString()
    .withMessage('Genre must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Genre is required.')
    .bail()
    .escape(),
  body('director')
    .isString()
    .withMessage('Director must be a string.')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Director is required.')
    .bail()
    .escape(),
];

const MovieRouter = Router()
  .get(
    '',
    query('minYear')
      .optional()
      .isInt({ min: 1 })
      .withMessage('minYear must be at least 1.')
      .toInt(),
    query('maxYear')
      .optional()
      .isInt({ min: 1 })
      .withMessage('maxYear must be at least 1.')
      .toInt(),
    query('minYear').custom((minYear, { req }) => {
      if (minYear && req.query?.maxYear && minYear > req.query.maxYear) {
        throw new Error('minYear must be less than or equal to maxYear.');
      }

      return true;
    }),
    handleValidationResult,
    (request: Request, response: Response): any => {
      const { minYear, maxYear } = request.query as { minYear?: number; maxYear?: number };
      let movies = database.movies;

      if (minYear != null) {
        movies = movies.filter((movie) => movie.year >= minYear);
      }

      if (movies.length && maxYear != null) {
        movies = movies.filter((movie) => movie.year <= maxYear);
      }

      response.send(movies);
    }
  )
  .get(
    '/:id',
    param('id').isInt().toInt().withMessage("ID isn't an integer"),
    handleValidationResult,
    movieExists,
    (_request: Request, response: Response): any => response.send(response.locals.movie)
  )
  .post(
    '/',
    createMovieValidationChain(),
    handleValidationResult,
    (request: Request, response: Response): any => {
      const movie: Movie = matchedData(request);
      movie.id = randomId();

      database.movies.push(movie);

      response.status(StatusCodes.CREATED).send(movie.id);
    }
  )
  .patch(
    '/:id',
    param('id').isInt().toInt().withMessage("ID isn't an integer"),
    createMovieValidationChain().map((chain) => chain.optional()),
    handleValidationResult,
    movieExists,
    (request: Request, response: Response): any => {
      const { id, ...updatedMovie }: { id: number; updatedMovie: Partial<Movie> } =
        matchedData(request);

      Object.assign(response.locals.movie, updatedMovie);
      response.sendStatus(StatusCodes.OK);
    }
  );

export default MovieRouter;
