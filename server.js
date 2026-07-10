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

app.get("/projects", async (req, res) => {
    const title = "Service Projects";

    res.render("projects", { title });
});

app.get("/categories", async (req, res) => {
    try {
        const title = "Service Project Categories";

        const categories = await getAllCategories();

        res.render("categories", {
            title,
            categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading categories");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});