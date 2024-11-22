import express from "express";
import cors from "cors";
import EmployeeController from "./routes/employee/controller.js";
import handleServerError from "./routes/middleware/error-handler.js";

const application = express()
  .use(cors(), express.json())
  .use("/employee", EmployeeController)
  .use(handleServerError);

export default application;
