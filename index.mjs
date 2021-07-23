import {} from "dotenv/config.js";
import axios from "axios";
import express from "express";
import cors from "cors";
import sass from "sass";
const app = express();
const PORT = process.env.PORT || 4000;

// Set view engine to ejs
app.set("view engine", "ejs");
app.use(cors());
app.use(express.static("static"));

//------------------------------ Routes
app.get("/", getProjects);
app.get("/page=:page", getProjects);
app.get("/relayProjects=:page", relayProjects);
app.get("/relayUserInfo=:userID", relayUserInfo);

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));

//------------------------------ Page Generators
// Send back HTML for projects page
function getProjects(req, res) {
  let perPage = 10;
  let pageNum = req.params.page || 1;
  const URL = `http://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}&per_page=${perPage}&page=${pageNum}`;

  return axios({
    method: "get",
    url: URL,
  })
    .then((response) => {
      res.locals.projectPageData = response.data;
      res.sendFile(`${process.cwd()}/client.js`);
      res.render("pages/index");
    })
    .catch((err) => console.log(err));
}

// Relay the projects JSON data from API so key isn't exposed on client side.
function relayProjects(req, res) {
  let perPage = 10;
  let pageNum = req.params.page || 1;
  const URL = `http://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}&per_page=${perPage}&page=${pageNum}`;

  return axios({
    method: "get",
    url: URL,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => console.log(err));
}

// Relay the user JSON data from API so key isn't exposed on client side.
function relayUserInfo(req, res) {
  const URL = `https://api.hackaday.io/v1/users/${req.params.userID}?api_key=${process.env.API_KEY}`;

  return axios({
    method: "get",
    url: URL,
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => console.log(err));
}
