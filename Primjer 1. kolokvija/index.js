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
  return fileSystem.promises.writeFile(
    databaseFile,
    JSON.stringify(database, null, 2)
  );
}

function addNewUser(user) {
  database.korisnici.push(user);
  return saveDatabase();
}

function getUserById(id) {
  return database.korisnici.find((korisnik) => korisnik.id == request.body.id);
}

// Primjer: GET http://localhost:3000/korisnici?ime=A&prezime=i
function buildFilterFunction(query) {
  const filters = [];

  if (query.ime) {
    filters.push((user) => user.ime.includes(query.ime));
  }

  if (query.prezime) {
    filters.push((user) => user.prezime.includes(query.prezime));
  }

  return (user) => filters.every((filter) => filter(user));
}

const userAttributes = ["id", "ime", "prezime"];

const app = express()
  .use(json())
  .get("/", (request, response) => response.send("Pozdrav, Alan Burić!"))
  .get("/korisnici", (request, response) => {
    const filterFunction = buildFilterFunction(request.query);
    const filteredUsers = database.korisnici.filter(filterFunction);

    response.send(filteredUsers);
  })
  .post("/korisnici", async (request, response) => {
    const invalidAttribute = userAttributes.find(
      (attribute) => typeof request.body[attribute] !== "string"
    );

    if (invalidAttribute) {
      return response
        .status(400)
        .send(`Greška! Nedostaje atribut ${invalidAttribute}`);
    } else if (getUserById(request.body.id)) {
      return response.status(400);
    }

    await addNewUser({
      id: request.body.id,
      ime: request.body.ime,
      prezime: request.body.prezime,
    });

    response.sendStatus(200);
  })
  .get("/korisnici/:id", (request, response) => {
    const user = getUserById(request.params.id);

    if (user) {
      return response.send({
        ...user,
        message: `Uspješno dohvaćen korisnik s ID-em ${request.params.id}`,
      });
    }

    response.sendStatus(404);
  });

const port = 3000;

app.listen(port, () => {
  database = loadDatabase();
  console.log(`Server is up and running on http://localhost:${port}`);
});
