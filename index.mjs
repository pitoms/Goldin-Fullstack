import "dotenv";
import express from "express";
import cors from "cors";
import sass from "sass";
const app = express();
const PORT = process.env.PORT || 4000;

// Set view engine to ejs
app.set("view engine", "ejs");

app.use(cors());

// Routes
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/projects/:id", function (req, res) {
  res.render("pages/index");
});

app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));
