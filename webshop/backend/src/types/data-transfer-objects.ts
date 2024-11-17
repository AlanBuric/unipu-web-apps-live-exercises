import { Order, Product } from "./database-types.js";
import { OptionalAndBoilerplateProductAttrs } from "../routes/product.js";

export type WithID = {
  id: string | number;
}
export type ProductPreview = Omit<Product, OptionalAndBoilerplateProductAttrs> & WithID & { imageUrl: string };
export type OrderRequest = Omit<Order, "cost">;