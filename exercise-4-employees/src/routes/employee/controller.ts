import { type Request, type Response, Router } from "express";
import { body, matchedData, param, query } from "express-validator";
import processValidation from "../middleware/validation.js";
import type { Employee } from "../../types/database-types.js";
import { StatusCodes } from "http-status-codes";
import EmployeeService from "./service.js";
import { type UUID } from "crypto";
import type {
  EmployeeQueryParams,
  WithId,
} from "../../types/data-transfer-objects.js";

function buildEmployeeBodyStringValidator(field: string) {
  return body(field)
    .exists()
    .withMessage(`Employee ${field} not provided`)
    .isString()
    .withMessage(`Employee ${field} needs to be a string`)
    .bail()
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
    body("experience")
      .exists()
      .withMessage("Employee experience not provided")
      .isInt({ min: 0 })
      .withMessage(
        "Employee years of experience need to be an integer, at least 0"
      ),
    processValidation,
    (request: Request, response: Response<UUID>): any => {
      const employee = matchedData<Employee>(request);

      EmployeeService.addEmployee(employee).then((id) =>
        response.status(StatusCodes.CREATED).send(id)
      );
    }
  )
  .get(
    "",
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
      .withMessage("experienceMin must be an integer, at least 0")
      .toInt(),
    query("experienceMax")
      .optional()
      .isInt({ min: 0 })
      .withMessage("experienceMax must be an integer, at least 0")
      .toInt(),
    processValidation,
    (
      request: Request<any, any, any, EmployeeQueryParams>,
      response: Response<WithId<Employee>[]>
    ): any => {
      const queryParams = matchedData<EmployeeQueryParams>(request);

      let iterator = Iterator.from(EmployeeService.getEmployees());

      if (queryParams.position) {
        queryParams.position = queryParams.position.toLowerCase();

        iterator = iterator.filter(({ position }) =>
          position.toLowerCase().includes(queryParams.position!)
        );
      }

      if (queryParams.experienceMin != null) {
        iterator = iterator.filter(
          ({ experience }) => experience >= queryParams.experienceMin!
        );
      }

      if (queryParams.experienceMax != null) {
        iterator = iterator.filter(
          ({ experience }) => experience <= queryParams.experienceMax!
        );
      }

      let employees = iterator.toArray();

      if (queryParams.sortByYears) {
        const orderMultiplier = queryParams.sortByYears === "asc" ? 1 : -1;

        employees.sort(
          (a, b) => (a.experience - b.experience) * orderMultiplier
        );
      }

      response.status(StatusCodes.OK).send(employees);
    }
  )
  .get(
    "/:employeeId",
    param("employeeId").isUUID().withMessage("Employee ID isn't a valid UUID"),
    processValidation,
    (request: Request, response: Response): any =>
      response.send(
        EmployeeService.getEmployeeById(
          matchedData<{ employeeId: UUID }>(request).employeeId
        )
      )
  );

export default EmployeeController;
