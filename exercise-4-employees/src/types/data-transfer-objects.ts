import type { UUID } from "crypto";

export type WithId<T, IdType = UUID> = T & {
  id: IdType;
};

export type EmployeeQueryParams = {
  sortByYears?: "asc" | "desc";
  position?: string;
  experienceMin?: number;
  experienceMax?: number;
};

export type ErrorResponse = {
  error: string;
  errors?: string[];
};
