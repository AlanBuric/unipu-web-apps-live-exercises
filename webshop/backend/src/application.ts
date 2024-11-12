import express, { json } from "express";
import ProizvodRouter from "./routes/proizvod.js";
import NarudzbaRouter from "./routes/narudzba.js";
import cors from "cors";

const application = express()
  .use(cors(), json())
  .use("/proizvod", ProizvodRouter)
  .use("/narudzba", NarudzbaRouter);

export default application;
