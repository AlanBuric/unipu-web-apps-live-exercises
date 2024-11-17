import express from "express";
import ProductRouter from "./routes/product.js";
import OrderRouter from "./routes/order.js";
import cors from "cors";
import errorHandler from "./util/error-handler.js";

const application = express()
  .use(cors(), express.json())
  .use("/product", ProductRouter)
  .use("/order", OrderRouter)
  .use(errorHandler);

export default application;
