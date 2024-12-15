import { config } from "dotenv";
import { connectToDatabase } from "./database/main.js";
import createApplication from "./application.js";

config();

await connectToDatabase();
const port = process.env.PORT ?? 3000;

createApplication().listen(port, () =>
  console.log(`Express server is up and running on http://localhost:${port}`)
);
