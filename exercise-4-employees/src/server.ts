import application from "./application.js";
import dotenv from "dotenv";
import { connectDatabase } from "./database/database.js";
import { styleText } from "util";

dotenv.config({ quiet: true });

await connectDatabase();

const port = process.env.PORT ?? 3000;

application.listen(port, () =>
  console.log(
    styleText("blue", `🚀 Server is up and running on http://localhost:${port}`)
  )
);
