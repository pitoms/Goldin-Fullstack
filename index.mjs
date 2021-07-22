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

//Add API Key to response variable so views have access
app.use((req, res, next) => {
  res.locals.keys = { key: process.env.API_KEY };
  next();
});

//------------------------------ Routes
app.get("/", function (req, res) {
  getProjects(10, 1);
});

app.get("/project/:id", function (req, res) {
  res.render("pages/project");
});

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));

//------------------------------ Fetch data functions

async function getProjects(perPage, pageNum) {
  // Fetch  projects from Hackaday API
  const URL = `http://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}&per_page=${perPage}&page=${pageNum}`;

  return axios({
    method: "get",
    url: URL,
  }).then((res) => {
    res.locals.projects = res.data;
    res.render("pages/index");
  });
}
