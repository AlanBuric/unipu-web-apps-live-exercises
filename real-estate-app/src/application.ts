import express, {json} from "express";
import errorHandler from "./middleware/error-handler.js";
import PropertyRouter from "./routes/property/router.js";
import OfferRouter from "./routes/offer/router.js";

const application = express()
    .use(json())
    .use("/offer", OfferRouter)
    .use("/property", PropertyRouter)
    .use(errorHandler);

export default application;
