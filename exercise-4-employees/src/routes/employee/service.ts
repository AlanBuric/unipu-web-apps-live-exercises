import type { Employee } from "../../types/database-types.js";
import { randomUUID, type UUID } from "crypto";
import { getDatabase } from "../../database/database.js";
import RequestError from "../../util/RequestError.js";
import { StatusCodes } from "http-status-codes";
import type { WithId } from "../../types/data-transfer-objects.js";

export default class EmployeeService {
  static *getEmployees() {
    const employees = getDatabase().data.employees;

    for (const id in employees) {
      yield {
        id: id as UUID,
        ...employees[id as UUID],
      } satisfies WithId<Employee>;
    }
  }

  static getEmployeeById(employeeId: UUID): Employee {
    const employee = getDatabase().data.employees[employeeId];

    if (!employee) {
      throw new RequestError(
        StatusCodes.NOT_FOUND,
        `Employee with UUID ${employeeId} doesn't exist`
      );
    }

    return employee;
  }

  static async addEmployee(employee: Employee): Promise<UUID> {
    const id = randomUUID();

    await getDatabase().update(({ employees }) => (employees[id] = employee));

    return id;
  }
}
