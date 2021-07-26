import {} from "dotenv/config.js";
import axios from "axios";
import express from "express";
import fs from "fs";
import cors from "cors";
import sass from "sass";
import path from "path";
const app = express();
const PORT = process.env.PORT || 4000;

// Set view engine to ejs
app.set("view engine", "ejs");
app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));

//------------------------------ Routes
app.get("/", getProjects);
app.get("/page=:page", getProjects);
app.get("/project=:id", getProject);
app.get("/relayProjects=:page", relayProjects);
app.get("/relayUserInfo=:userID", relayUserInfo);

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));

// Because hackaday is broke and cant pay for server resources
let projectsCache = new Map(); // key = page #, value = JSON response object
let projectCache = new Map(); // key = project #, value = JSON response object
let userCache = new Map(); // key = user #, value = JSON response object
let recsCache = new Map(); // key = project #, value = JSON recomendations

//------------------------------ Page Generators
// Send back HTML for projects page
function getProjects(req, res) {
  let perPage = 12;
  let pageNum = req.params.page || 1;
  const URL = `http://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}&per_page=${perPage}&page=${pageNum}`;

  if (!projectsCache.has(pageNum)) {
    axios
      .get(URL)
      .then((response) => {
        res.locals.projectPageData = response.data;
        // res.locals.projectListTemplate = getEJSTemplate("./views/partials/projectList.ejs");
        projectsCache.set(pageNum, response.data);

        res.render("pages/index");
      })
      .catch((err) => console.log(err));
  } else {
    res.locals.projectPageData = projectsCache.get(pageNum);
    res.render("pages/index");
  }
}

//Grabs a server EJS File and stringify's it.
// Allows Serverside templates to be reused on client side
function getEJSTemplate(path) {
  return fs.readFileSync(path, "UTF-8");
}

// Relay the projects JSON data from API so key isn't exposed on client side.
function relayProjects(req, res) {
  let perPage = 12;
  let pageNum = req.params.page || 1;
  const URL = `http://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}&per_page=${perPage}&page=${pageNum}`;

  if (!projectsCache.has(pageNum)) {
    axios
      .get(URL)
      .then((response) => {
        projectsCache.set(pageNum, response.data);
        res.json(response.data);
      })
      .catch((err) => console.log(err));
  } else {
    res.json(projectsCache.get(pageNum));
  }
}

// Relay the user JSON data from API so key isn't exposed on client side.
function relayUserInfo(req, res) {
  let userID = req.params.userID;
  const URL = `https://api.hackaday.io/v1/users/${userID}?api_key=${process.env.API_KEY}`;

  if (!userCache.has(userID)) {
    axios
      .get(URL)
      .then((response) => {
        userCache.set(userID, response.data);
        res.json(response.data);
      })
      .catch((err) => console.log(err));
  } else {
    res.json(userCache.get(userID));
  }
}

// Fetch project data and display it on the server
function getProject(req, res) {
  let id = req.params.id;
  const URL = `http://api.hackaday.io/v1/projects/${req.params.id}?api_key=${process.env.API_KEY}`;

  if (!projectCache.has(id)) {
    axios
      .get(URL)
      .then((response) => {
        res.locals.projectInfo = response.data;
        res.locals.recs = getRecommendProjects(response.data);
        console.log("Response local obj------------------------", res.locals.recs);
        projectCache.set(id, response.data);
      })
      .then((response) => {
        res.render("pages/projectInfo");
      })
      .catch((err) => console.log(err));
  } else {
    res.locals.projectInfo = projectCache.get(id);
    res.render("pages/projectInfo");
  }
}

async function getRecommendProjects(projectData) {
  let projectID = projectData.id;

  // Iterate through tags and store project recs until
  if (!recsCache.has(projectID)) {
    let tags = projectData.tags;
    console.log(tags);
    let recs = [];
    for (let i = 0; i < 3; i++) {
      let URL = `https://api.hackaday.io/v1/search/projects?api_key=${process.env.API_KEY}&search_term=${tags[i % tags.length]}&per_page=2`;
      await axios
        .get(URL)
        .then((response) => {
          recs.push(response.data);
        })
        .catch((err) => console.log(err));
    }
    recsCache.set(projectID, recs);
    // console.log(recs);
    return recs;
  } else {
    return recsCache.get(id);
  }
}
