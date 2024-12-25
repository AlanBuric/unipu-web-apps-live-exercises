import type { TasksResponse } from "@shared-types/data-transfer-objects.ts";

export type EditingTask = Omit<TasksResponse["tasks"][number], "tagIds"> & { tagIds: Set<string> };
