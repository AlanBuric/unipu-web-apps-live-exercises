import type { Order, Product } from "./database-types.js";
import type { OptionalAndBoilerplateProductAttrs } from "../routes/product.js";

export type WithID = {
  id: string | number;
}
export type ProductPreview = Omit<Product, OptionalAndBoilerplateProductAttrs> & WithID & { imageUrl: string };
export type OrderRequest = Omit<Order, "cost">;