import type { UUID } from "crypto";

export type WithUUID = {
  id: UUID;
}

export type EmployeeQueryParams = {
  sortByYears?: 'asc' | 'desc';
  position?: string;
  experienceMin?: number;
  experienceMax?: number;
}

export type ErrorResponse = {
  error: string;
  errors?: string[];
}