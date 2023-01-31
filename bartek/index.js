const express = require("express");
const eta = require("eta");
const pg = require("pg");

const app = express();
const port = process.env.PORT || 8080;


const { Client } = require("pg");
const client = new Client({
  connectionString: "postgres://postgres:Password!@bartek-azure.postgres.database.azure.com/postgres?sslmode=require"

});

app.use(express.urlencoded());
app.engine("eta", eta.renderFile);
eta.configure({ views: "./views", cache: true });
app.set("views", "./views");
app.set("view cache", true);
app.set("view engine", "eta");

// used for getting messages
app.get("/", async function (req, res) {
  //   const message = await db
  const result = await client.query(`SELECT * FROM messages`);
  console.log(result);
  res.render("index", {
    messages: result.rows,
  });
});

app.get("/post", function (req, res) {
  res.render("addMessage", {});
});

app.post("/post", async function (req, res) {
  const result = await client.query(
    `CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, message VARCHAR ( 255 ) NOT NULL ); INSERT INTO messages(id, message) VALUES (DEFAULT, '${req.body.message}');`
  );
  res.redirect("/");
});

app.listen(port, () => console.log("App started"));

const connect = async () => {
  await client.connect();
};

connect();
