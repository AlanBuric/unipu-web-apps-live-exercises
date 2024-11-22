import { type Request, type Response, Router } from "express";
import { body, matchedData, param } from "express-validator";
import processValidation from "../middleware/validation.js";
import type { Employee } from "../../types/database-types.js";
import { StatusCodes } from "http-status-codes";
import EmployeeService from "./service.js";
import { type UUID } from "crypto";

function buildEmployeeBodyStringValidator(field: string) {
  return body(field)
    .isString()
    .withMessage(`Employee ${field} needs to be a string`)
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Employee ${field} needs to be at least 1 character long`);
}

const EmployeeController = Router()
  .post(
    "",
    buildEmployeeBodyStringValidator("name"),
    buildEmployeeBodyStringValidator("surname"),
    buildEmployeeBodyStringValidator("position"),
    body("yearsOfExperience")
      .isInt({ min: 0 })
      .withMessage("Employee years of experience need to be an integer, at least 0"),
    processValidation,
    (request: Request, response: Response<UUID>): any => {
      const employee = matchedData<Employee>(request);

      EmployeeService.addEmployee(employee)
        .then(id => response.status(StatusCodes.CREATED).send(id));
    }
  )
  .get("", (request: Request, response: Response): any => response.send(EmployeeService.getEmployees()))
  .get(
    "/:employeeId",
    param("employeeId")
      .isUUID()
      .withMessage("Employee ID isn't a valid UUID"),
    processValidation,
    (request: Request, response: Response): any =>
      response.send(EmployeeService.getEmployeeById(matchedData<{ employeeId: UUID }>(request).employeeId))
  );

export default EmployeeController;
