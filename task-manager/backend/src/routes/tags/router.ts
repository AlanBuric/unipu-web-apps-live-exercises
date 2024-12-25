import { Request, Response, Router } from "express";
import getDatabase from "../../database/driver.js";
import { Tag } from "../../types/database-types.js";
import { body, matchedData, param } from "express-validator";
import { ObjectId, WithId } from "mongodb";
import { StatusCodes } from "http-status-codes";
import RequestError from "../../util/RequestError.js";
import handleValidationResult from "../../util/validation.js";
import { MinMaxOptions } from "express-validator/lib/options.js";

const COLOR_MIN_MAX: MinMaxOptions = { min: 0x000000, max: 0xFFFFFF };

const TagRouter = Router()
  .get("",
    async (request: Request, response: Response<WithId<Tag>[]>): Promise<any> => {
      const tags = await getDatabase().collection<Tag>("tags").find().toArray();
      response.send(tags);
    }
  )
  .post("",
    body("name")
      .exists()
      .withMessage("Tag name is required")
      .isString()
      .withMessage("Tag name must be a string"),
    body("color")
      .exists()
      .withMessage("Tag color is required")
      .isInt(COLOR_MIN_MAX)
      .withMessage("Color must be a valid 24-bit RGB value"),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const tag = matchedData<Tag>(request);

      const result = await getDatabase().collection<Tag>("tags").insertOne(tag);

      if (result.acknowledged) {
        return response.status(StatusCodes.CREATED).send(result.insertedId);
      }

      console.error("MongoDB did not acknowledge the tag creation request");
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create tag");
    }
  )
  .delete("/:id",
    param("id")
      .exists()
      .withMessage("Tag ID is required")
      .isString()
      .withMessage("Tag ID must be a string"),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const { id } = matchedData<{ id: string }>(request);

      const result = await getDatabase().collection<Tag>("tags").deleteOne({ _id: new ObjectId(id) });

      if (result.acknowledged) {
        if (result.deletedCount) {
          return response.sendStatus(StatusCodes.OK);
        }

        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      console.error(`MongoDB didn't acknowledge the deletion request for tag with ID ${id}`);
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete tag");
    }
  )
  .patch("/:id",
    param("id")
      .exists()
      .withMessage("Tag ID is required")
      .isString()
      .withMessage("Tag ID must be a string"),
    body("name")
      .optional()
      .isString()
      .withMessage("Tag name must be a string"),
    body("color")
      .optional()
      .isInt(COLOR_MIN_MAX)
      .withMessage("Color must be a valid 24-bit RGB value"),
    handleValidationResult,
    async (request: Request, response: Response): Promise<any> => {
      const { id } = matchedData<{ id: string }>(request);
      const updates = matchedData<Partial<Tag>>(request, { locations: ["body"] });

      const result = await getDatabase().collection<Tag>("tags").updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      if (result.acknowledged) {
        if (result.matchedCount) {
          return response.sendStatus(StatusCodes.OK);
        }

        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      console.error(`MongoDB didn't acknowledge the update request for tag with ID ${id}`);
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update tag");
    }
  );

export default TagRouter;