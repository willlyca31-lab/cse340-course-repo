require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Static middleware
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Home
app.get("/", (req, res) => {
res.render("home", {
title: "Home"
});
});

// Organizations
app.get("/organizations", (req, res) => {
res.render("organizations", {
title: "Our Partner Organizations"
});
});

// Projects
app.get("/projects", (req, res) => {
res.render("projects", {
title: "Service Projects"
});
});

// Categories
app.get("/categories", (req, res) => {
res.render("categories", {
title: "Service Project Categories"
});
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
