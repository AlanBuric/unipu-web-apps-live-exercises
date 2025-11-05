import { type Request, type Response, Router } from "express";
import type { Product } from "../types/database-types.js";
import { matchedData, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import RequestError from "../util/RequestError.js";
import processValidation from "../util/validation.js";
import type { ProductPreview } from "../types/data-transfer-objects.js";
import { withoutProperties } from "../util/types.js";
import AutoIncrementer from "../util/AutoIncrementer.js";

const products: Record<number, Product> = {};
const autoIncrement = new AutoIncrementer();
export const optionalAndBoilerplateAttrs = ["details", "description", "imageUrls", "characteristics", "sizes", "colors"] as const;
export type OptionalAndBoilerplateProductAttrs = typeof optionalAndBoilerplateAttrs[number];

export function addProduct(product: Omit<Product, OptionalAndBoilerplateProductAttrs> & Partial<Pick<Product, OptionalAndBoilerplateProductAttrs>>): number {
  const id = autoIncrement.getAndIncrement();
  products[id] = {
    sizes: [],
    details: "",
    description: "",
    characteristics: [],
    imageUrls: [],
    colors: [],
    ...product
  };

  return id;
}

export function getProduct(id: number): Product {
  const product = products[id];

  if (!product) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      `Proizvod s ID-em ${id} ne postoji`
    );
  }

  return product;
}

const ProductRouter = Router()
  .get("", (request: Request, response: Response<ProductPreview[]>): any =>
    response.send(
      Object.entries(products).map(([id, product]) => ({
        id,
        ...withoutProperties(product, ...optionalAndBoilerplateAttrs),
        imageUrl: product.imageUrls[0]
      }))
    )
  )
  .get(
    "/:id",
    param("id")
      .isInt()
      .withMessage("ID nije validni cijeli broj"),
    processValidation,
    (request: Request, response: Response<Product>): any => {
      const { id } = matchedData(request);
      const product = products[id];

      if (!product) {
        return response.sendStatus(StatusCodes.NOT_FOUND);
      }

      response.send(product);
    }
  );

export default ProductRouter;
