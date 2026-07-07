require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

/* Routes */

app.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
});

app.get("/organizations", (req, res) => {
    res.render("organizations", {
        title: "Our Partner Organizations"
    });
});

app.get("/projects", (req, res) => {
    res.render("projects", {
        title: "Service Projects"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});