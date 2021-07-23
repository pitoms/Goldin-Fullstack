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

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));

//------------------------------ HTML Generation
function getProjects(req, res) {
  let perPage = 10;
  let pageNum = req.params.page || 1;
  const URL = `http://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}&per_page=${perPage}&page=${pageNum}`;

  return axios({
    method: "get",
    url: URL,
  })
    .then((response) => {
      console.log(response.data);
      res.locals.projectPageData = response.data;
      console.log(process.cwd());
      res.sendFile(`${process.cwd()}/clientSideFunctionality.js`);
      res.render("pages/index");
    })
    .catch((err) => console.log(err));
}
