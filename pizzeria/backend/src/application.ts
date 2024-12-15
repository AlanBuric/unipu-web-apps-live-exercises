import express, { json } from "express";
import cors from "cors";
import OrderRouter from "./routes/order/router.js";
import PizzaRouter from "./routes/pizza/router.js";
import handleServerErrors from "./util/error-handler.js";

export default function createApplication() {
  return express()
    .use(cors(), json())
    .use("/pizza", PizzaRouter)
    .use("/order", OrderRouter)
    .use(handleServerErrors);
}