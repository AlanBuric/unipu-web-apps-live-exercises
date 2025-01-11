import express, { json } from 'express';
import cors from 'cors';
import handleServerErrors from './middleware/error.js';
import logRequest from './middleware/logger.js';
import ActorRouter from './routes/actor.js';
import MovieRouter from './routes/movie.js';
import chalk from 'chalk';

const port = 3000;

express()
  .use(logRequest, cors(), json())
  .use('/actor', ActorRouter)
  .use('/movie', MovieRouter)
  .use(handleServerErrors)
  .listen(port, () =>
    console.log(
      chalk.greenBright.bold(
        `[movie-server] Movie server is up and running on http://localhost:${port}.`
      )
    )
  );
