import {} from "dotenv/config.js";
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

// Routes
app.get("/", function (req, res) {
  console.log(process.env.API_KEY);
  res.render("pages/index");
});

app.get("/projects/:id", function (req, res) {
  res.render("pages/project");
});

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));
