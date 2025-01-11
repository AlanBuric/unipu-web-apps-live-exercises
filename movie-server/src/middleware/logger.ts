import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

export default function logRequest(request: Request, _response: Response, next: NextFunction) {
  console.log(
    chalk.blue('[movie-server] ') +
      chalk.blueBright(`[${new Date().toLocaleString()}] ${request.method} ${request.url}`)
  );
  next();
}
