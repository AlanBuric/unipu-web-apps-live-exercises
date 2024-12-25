import { Request, Response, Router } from "express";
import getDatabase from "../../database/driver.js";
import { Tag, Task } from "../../types/database-types.js";
import { body, matchedData, param } from "express-validator";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import RequestError from "../../util/RequestError.js";
import handleValidationResult from "../../util/validation.js";
import { MinMaxOptions } from "express-validator/lib/options.js";

const TAG_IDS_ARRAY_MIN_MAX_OPTIONS: MinMaxOptions = { max: 10 };

const TaskRouter = Router()
  .get("",
    async (request: Request, response: Response): Promise<any> =>
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
      .withMessage("Task name needs to be a string")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Task name length needs to be at least 1"),
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
      .withMessage(`A task may have up to ${TAG_IDS_ARRAY_MIN_MAX_OPTIONS.max} tags`),
    body("tagIds.*")
      .optional()
      .custom((_id: string) => {
        if (!ObjectId.isValid(_id)) {
          throw new Error(`Tag ID ${_id} is of invalid format`);
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
        return response.status(StatusCodes.CREATED).send(result.insertedId);
      }

      console.error(`MongoDB didn't acknowledge the task saving request for a new task`);

      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Saving failed");
    })
  .patch("/:id",
    param("id")
      .exists()
      .withMessage("Task ID is required")
      .isString()
      .withMessage("Task ID must be a string"),
    body("name")
      .optional()
      .trim()
      .isString()
      .withMessage("Task name must be a string")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Task name length needs to be at least 1"),
    body("description")
      .optional()
      .trim()
      .isString()
      .withMessage("Task description must be a string"),
    body("done")
      .optional()
      .isBoolean()
      .withMessage("Task done status must be a boolean"),
    body("tagIds")
      .optional()
      .isArray(TAG_IDS_ARRAY_MIN_MAX_OPTIONS)
      .withMessage(`A task may have up to ${TAG_IDS_ARRAY_MIN_MAX_OPTIONS.max} tags`),
    body("tagIds.*")
      .optional()
      .custom(ObjectId.isValid)
      .withMessage(_id => `Tag ID ${_id} is of invalid format`),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const { id, ...task } = matchedData<{ id: string } & Task>(request);

      if (task.tagIds) {
        const tagIds = task.tagIds.map(tagId => new ObjectId(tagId));
        const tags = await getDatabase()
          .collection<Tag>("tags")
          .find({ _id: { $in: tagIds } })
          .toArray();

        if (tags.length !== tagIds.length) {
          throw new RequestError(StatusCodes.NOT_FOUND, "Not all tag IDs exist, or duplicates were provided");
        }

        task.tagIds = tagIds.map(tag => tag.toHexString());
      }

      const result = await getDatabase()
        .collection<Task>("tasks")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: task }
        );

      if (result.matchedCount === 0) {
        return response.status(StatusCodes.NOT_FOUND).send("Task not found");
      } else if (result.modifiedCount > 0) {
        return response.sendStatus(StatusCodes.OK);
      }
    }
  )
  .delete("/:id",
    param("id")
      .exists()
      .withMessage("Task ID is required")
      .isString()
      .withMessage("Task ID needs to be a string")
      .custom(ObjectId.isValid)
      .withMessage(_id => `Tag ID ${_id} is of invalid format`),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const { id } = matchedData<{ id: string }>(request);
      const result = await getDatabase().collection<Task>("tasks").deleteOne({ _id: new ObjectId(id) });

      if (result.acknowledged && result.deletedCount) {
        return response.sendStatus(StatusCodes.OK);
      }

      response.sendStatus(StatusCodes.NOT_FOUND);
    });

export default TaskRouter;