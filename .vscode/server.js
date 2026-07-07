app.get("/categories", (req, res) => {
    res.render("categories", {
        title: "Service Project Categories"
    });
});

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));