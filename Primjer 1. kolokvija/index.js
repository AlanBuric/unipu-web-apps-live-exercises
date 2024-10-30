import express, { json } from "express";
import fileSystem from "fs";
import path from "path";

const databaseFile = path.resolve("./database/data.json");
var database = {};

function loadDatabase() {
  return JSON.parse(
    fileSystem.readFileSync(databaseFile, {
      encoding: "UTF-8",
    })
  );
}

function saveDatabase() {
  return fileSystem.promises.writeFile(databaseFile, JSON.stringify(database));
}

function addNewUser(user) {
  database.korisnici.push(user);
  return saveDatabase();
}

const userAttributes = ["id", "ime", "prezime"];

const app = express()
  .use(json())
  .get("/", (request, response) => response.send("Pozdrav, Alan Burić!"))
  .get("/korisnici", (request, response) => response.send(database.korisnici))
  .post("/korisnici", async (request, response) => {
    const invalidAttribute = userAttributes.find(
      (attribute) => typeof request.body[attribute] !== "string"
    );

    if (invalidAttribute) {
      return response
        .status(400)
        .send(`Greška! Nedostaje atribut ${invalidAttribute}`);
    } else if (
      database.korisnici.find((korisnik) => korisnik.id == request.body.id)
    ) {
      return response.status(400);
    }

    await addNewUser({
      id: request.body.id,
      ime: request.body.ime,
      prezime: request.body.prezime,
    });

    response.sendStatus(200);
  });

const port = 3000;

app.listen(port, () => {
  database = loadDatabase();
  console.log(`Server is up and running on http://localhost:${port}`);
});
