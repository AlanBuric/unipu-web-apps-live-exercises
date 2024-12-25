import { Request, Response, Router } from "express";
import getDatabase from "../../database/driver.js";
import { Tag, Task } from "../../types/database-types.js";
import { TasksResponse } from "../../types/data-transfer-objects.js";
import { body, matchedData, param } from "express-validator";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import RequestError from "../../util/RequestError.js";
import handleValidationResult from "../../util/validation.js";
import { MinMaxOptions } from "express-validator/lib/options.js";

const TAG_IDS_ARRAY_MIN_MAX_OPTIONS: MinMaxOptions = { min: 1, max: 10 };

const TaskRouter = Router()
  .get("",
    async (request: Request, response: Response<TasksResponse>): Promise<any> =>
      Promise.all([
        getDatabase()
          .collection<Task>("tasks")
          .find()
          .toArray(),
        getDatabase()
          .collection<Tag>("tags")
          .find()
          .toArray()
      ]).then(([tasks, tags]) => response.send({ tasks, tags }))
  )
  .post("",
    body("name")
      .exists()
      .withMessage("Task name is required")
      .isString()
      .withMessage("Task name needs to be a string"),
    body("description")
      .exists()
      .withMessage("Task description is required")
      .isString()
      .withMessage("Task description needs to be a string"),
    body("description")
      .exists()
      .withMessage("Task description is required")
      .isString()
      .withMessage("Task description needs to be a string"),
    body("tagIds")
      .optional()
      .isArray(TAG_IDS_ARRAY_MIN_MAX_OPTIONS)
      .withMessage(`tagIds is a required array with an element count between ${TAG_IDS_ARRAY_MIN_MAX_OPTIONS.min} and ${TAG_IDS_ARRAY_MIN_MAX_OPTIONS.max} inclusive`),
    body("tagIds.*")
      .optional()
      .custom((array: string[]) => {
        const invalid = array.find(id => ObjectId.isValid(id));

        if (invalid) {
          throw new Error(`Tag ID ${invalid} is of invalid format`);
        }

        return true;
      }),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const task = matchedData<Task>(request);

      task.done = false;

      if (task.tagIds == null) {
        task.tagIds = [];
      }

      const tagIds = task.tagIds.map(tagId => new ObjectId(tagId));

      if (tagIds.length) {
        await getDatabase()
          .collection<Tag>("tags")
          .find({ _id: { $in: tagIds } })
          .toArray()
          .then(docs => {
            if (docs.length !== tagIds.length) {
              throw new RequestError(StatusCodes.NOT_FOUND, "Not all tag IDs exist, or duplicate were provided");
            }
          });
      }

      const result = await getDatabase()
        .collection<Task>("tasks")
        .insertOne(task);

      if (result.acknowledged) {
        return response.status(StatusCodes.CREATED).send(result.acknowledged);
      }

      console.error(`MongoDB didn't acknowledge the task saving request for a new task`);

      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Saving failed");
    })
  .delete("/:id",
    param("id")
      .exists()
      .withMessage("Task ID is required")
      .isString()
      .withMessage("Task ID needs to be a string"),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const { id } = matchedData<{ id: string }>(request);
      const result = await getDatabase().collection<Task>("tasks").deleteOne({ _id: new ObjectId(id) });

      if (result.acknowledged) {
        if (result.deletedCount) {
          return response.sendStatus(StatusCodes.OK);
        }

        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      console.error(`MongoDB didn't acknowledge the deletion request for task with ID ${id}`);

      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Deletion failed");
    });

export default TaskRouter;