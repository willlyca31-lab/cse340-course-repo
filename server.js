import session from "express-session";
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

const SESSION_SECRET = process.env.SESSION_SECRET;


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";


// Define the port number
const PORT = process.env.PORT || 3000;


const app = express();

/*
 * Session Management
 */
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);


// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/*
 * Allow Express to receive and process common POST data
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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