import type { Employee } from "../../types/database-types.js";
import { randomUUID, type UUID } from "crypto";
import { getDatabase } from "../../database/database.js";
import RequestError from "../../util/RequestError.js";
import { StatusCodes } from "http-status-codes";
import type { WithUUID } from "../../types/data-transfer-objects.js";

export default class EmployeeService {
  static getEmployees(): (Employee & WithUUID)[] {
    return Object.entries(getDatabase().data.employees)
      .map(([id, employee]) => ({ id: id as UUID, ...employee }));
  }

  static getEmployeeById(employeeId: UUID): Employee {
    const employee = getDatabase().data.employees[employeeId];

    if (!employee) {
      throw new RequestError(StatusCodes.NOT_FOUND, `Employee with UUID ${employeeId} doesn't exist`);
    }

    return employee;
  }

  static async addEmployee(employee: Employee): Promise<UUID> {
    const id = randomUUID();

    await getDatabase().update(({ employees }) => employees[id] = employee);

    return id;
  }
}