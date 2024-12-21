import { config } from "dotenv";
import express, { json, Router } from "express";
import cors from "cors";
import handleServerErrors from "./util/error-handler.js";
import TaskRouter from "./routes/task/router.js";
import { connectToDatabase } from "./database/driver.js";

config();

await connectToDatabase();

const port = process.env.PORT ?? 3000;
const app = express().use(
  "/api",
  cors(),
  json(),
  Router().use("/tasks", TaskRouter),
  handleServerErrors);

app.listen(port, () => {
  console.log(`Express server is up and running on http://localhost:${port}`);
});
