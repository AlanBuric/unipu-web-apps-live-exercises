import { config } from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import handleServerErrors from './middleware/error-handler.js';
import TaskRouter from './routes/task/router.js';
import { connectToDatabase } from './database/driver.js';
import TagRouter from './routes/tags/router.js';
import SessionRouter from './routes/session/router.js';
import handleSession from './middleware/authorization.js';
import getLoggingPrefix from './util/logging.js';

config();

await connectToDatabase();

const port = process.env.PORT ?? 3000;
const app = express()
  .use('/api', cors(), json(), SessionRouter(), handleSession)
  .use('/api/tasks', TaskRouter)
  .use('/api/tags', TagRouter)
  .use(handleServerErrors);

app.listen(port, () =>
  console.log(
    `${getLoggingPrefix()} TaskManager server is up and running on http://localhost:${port}`
  )
);
