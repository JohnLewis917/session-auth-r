require("dotenv").config();
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const ac = require("./controllers/authController");
const { initSession } = require("./middleware/userInit");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET, //need to have long session code in .env
    saveUninitialized: true,
    resave: false,
    cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365
    }
  })
);

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db is all good");
  app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} is listening`));
});

app.post('/auth/user', ac.register)
app.post('/auth/login/user', ac.login)
app.delete('/auth/user', ac.logout)
// app.get('/api/user')