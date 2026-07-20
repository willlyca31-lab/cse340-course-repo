import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import router from "./src/routes.js";

import { testConnection } from "./src/models/db.js";

import {
    errorHandler,
    testErrorPage
} from "./src/controllers/errors.js";

dotenv.config();


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";


// Define the port number
const PORT = process.env.PORT || 3000;


const app = express();


// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/*
 * Static Files
 */
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


/*
 * View Engine
 */
app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "src/views")
);


/*
 * Log every request
 */
app.use((req, res, next) => {

    if (NODE_ENV === "development") {

        console.log(`${req.method} ${req.url}`);

    }

    next();

});


/*
 * Make NODE_ENV available to templates
 */
app.use((req, res, next) => {

    res.locals.NODE_ENV = NODE_ENV;

    next();

});


/*
 * Parse Form Data
 */
app.use(
    express.urlencoded({
        extended: true
    })
);


/*
 * Parse JSON
 */
app.use(express.json());


/*
 * Routes
 */
app.use(router);


/*
 * Test 500 Error
 */
app.get("/test-error", testErrorPage);


/*
 * Catch-all 404 Route
 */
app.use((req, res, next) => {

    const err = new Error("Page Not Found");

    err.status = 404;

    next(err);

});


/*
 * Global Error Handler
 */
app.use(errorHandler);


/*
 * Start Server
 */
app.listen(PORT, async () => {

    try {

        await testConnection();

        console.log(`Server running on port ${PORT}`);

        console.log(`Environment: ${NODE_ENV}`);

    } catch (err) {

        console.error(
            "Database connection failed:",
            err
        );

    }

});