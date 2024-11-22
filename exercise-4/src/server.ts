import application from "./application.js";
import dotenv from "dotenv";
import { connectDatabase } from "./database/database.js";

dotenv.config();

await connectDatabase();

const port = process.env.PORT ?? 3000;

application.listen(port, () => console.log(`\x1b[46mServer is up and running on http://localhost:${port}\x1b[0m`));