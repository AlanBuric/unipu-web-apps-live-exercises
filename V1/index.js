const express = require("express");
const path = require("path");

const port = 3000;
const app = express();

app
  .get("/", (req, res) => res.sendFile(path.resolve("./public/index.html")))
  .get("/about", (req, res) =>
    res.sendFile(path.resolve("./public/about.html"))
  )
  .get("/users", (req, res) => {
    res.json([
      {
        id: 1,
        ime: "Alan",
        prezime: "Burić",
      },
      {
        id: 2,
        ime: "Ana",
        prezime: "Anić",
      },
      {
        id: 9,
        ime: "Ivo",
        prezime: "Ivić",
      },
    ]);
  });

app.listen(port, () =>
  console.log(`Express server is up and running on http://localhost:${port}`)
);
