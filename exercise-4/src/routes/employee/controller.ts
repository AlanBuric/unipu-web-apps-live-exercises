import { type Request, type Response, Router } from "express";
import { body, matchedData, param, query } from "express-validator";
import processValidation from "../middleware/validation.js";
import type { Employee } from "../../types/database-types.js";
import { StatusCodes } from "http-status-codes";
import EmployeeService from "./service.js";
import { type UUID } from "crypto";
import type { EmployeeQueryParams, WithUUID } from "../../types/data-transfer-objects.js";

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
  .get("",
    query("sortByYears")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("sortByYears must be 'asc' or 'desc'"),
    query("position")
      .optional()
      .isString()
      .withMessage("position must be a string")
      .trim()
      .isLength({ min: 1 })
      .withMessage("position must be at least 1 character long")
      .bail()
      .toLowerCase(),
    query("experienceMin")
      .optional()
      .isInt({ min: 0 })
      .withMessage("experienceMin must be an integer greater than or equal to 0"),
    query("experienceMax")
      .optional()
      .isInt({ min: 0 })
      .withMessage("experienceMax must be an integer greater than or equal to 0"),
    processValidation,
    (request: Request<any, any, any, EmployeeQueryParams>, response: Response<(Employee & WithUUID)[]>): any => {
      const queryParams = matchedData<EmployeeQueryParams>(request);

      let employees = EmployeeService.getEmployees();

      const filterFunctions: ((employee: Employee) => boolean)[] = [];

      if (queryParams.position) {
        filterFunctions.push(employee => employee.position.toLowerCase().includes(queryParams.position! ));
      }

      if (queryParams.experienceMin != null) {
        filterFunctions.push(employee => employee.experience >= queryParams.experienceMin!);
      }

      if (queryParams.experienceMax != null) {
        filterFunctions.push(employee => employee.experience <= queryParams.experienceMax!);
      }

      employees = employees.filter(employee => filterFunctions.every(fn => fn(employee)));

      if (queryParams.sortByYears) {
        const orderMultiplier = queryParams.sortByYears === "asc" ? 1 : -1;
        employees = employees.sort((a, b) => (a.experience - b.experience) * orderMultiplier);
      }

      response.status(StatusCodes.OK).send(employees);
    })
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
