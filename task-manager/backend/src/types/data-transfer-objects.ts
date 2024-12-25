import { Tag, Task, WithId } from "./database-types.js";

export type TasksResponse = {
  tasks: WithId<Task>[],
  tags: TagsResponse
};

export type TagsResponse = WithId<Tag>[];