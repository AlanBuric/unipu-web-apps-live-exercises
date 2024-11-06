import application from "./application.js";

const port = 3000;

application.listen(port, () =>
  console.log(`Express server is up and running on http://localhost:${port}`)
);
