import { Tag, Task } from "./database-types.js";
import { WithId } from "mongodb";

export type TasksResponse = {
  tasks: WithId<Task>[];
  tags: WithId<Tag>[];
}