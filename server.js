import { testConnection } from "./src/models/db.js";
import { getAllCategories } from "./src/models/categories.js";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

/*
 * Routes
 */

app.get("/", async (req, res) => {
    const title = "Home";

    res.render("home", { title });
});

app.get("/organizations", async (req, res) => {
    const title = "Our Partner Organizations";

    res.render("organizations", { title });
});

const { getAllProjects } = require("./src/models/projects");

app.get("/projects", async (req, res) => {
    try {
        const projects = await getAllProjects();

        res.render("projects", {
            title: "Service Projects",
            projects
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/categories", async (req, res) => {
    try {
        const categories = await getAllCategories();

        res.render("categories", {
            title: "Categories",
            categories
        });
    } catch (err) {
         console.error("Categories error:");
         console.error(err);

         res.status(500).send("Unable to load categories.");
    }
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
});