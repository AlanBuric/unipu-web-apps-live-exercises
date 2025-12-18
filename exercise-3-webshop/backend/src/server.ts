import application from "./application.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

await import("./database/init-data.js");

const port = process.env.PORT ?? 3000;

application.listen(port, () =>
  console.log(
    `\x1b[46mServer is up and running on http://localhost:${port}\x1b[0m`
  )
);
