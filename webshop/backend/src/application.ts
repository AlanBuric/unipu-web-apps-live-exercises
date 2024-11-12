import express, { json } from "express";
import ProizvodRouter from "./routes/proizvod.js";
import NarudzbaRouter from "./routes/narudzba.js";

const application = express()
  .use(json())
  .use("/proizvod", ProizvodRouter)
  .use("/narudzba", NarudzbaRouter);

export default application;
