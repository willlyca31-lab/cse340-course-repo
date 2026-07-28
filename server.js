import flash from "./src/middleware/flash.js";
import session from "express-session";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import router from "./src/routes.js";

import {
    testConnection
} from "./src/models/db.js";

import {
    errorHandler
} from "./src/controllers/errors.js";

dotenv.config();

/*
 * Fix __dirname for ES Modules
 */
const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

/*
 * Environment Variables
 */
const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    "cse340-secret";

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() ||
    "development";

const PORT =
    process.env.PORT ||
    3000;

/*
 * Create Express App
 */
const app = express();

/*
 * Body Parser Middleware
 */
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.json()
);

/*
 * Session Middleware
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

/*
 * Flash Middleware
 */
app.use(flash);

/*
 * Make flash messages available in all views
 */
app.use(
    (req, res, next) => {

        res.locals.flash = req.flash;

        next();

    }
);

/*
 * Static Files
 */
app.use(
    express.static(
        path.join(
            __dirname,
            "src",
            "public"
        )
    )
);

/*
 * View Engine
 */
app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(
        __dirname,
        "src",
        "views"
    )
);

/*
 * Global Template Variables
 */
app.use(
    (req, res, next) => {

        res.locals.NODE_ENV =
            NODE_ENV;

        next();

    }
);

/*
 * Development Logger
 */
app.use(
    (req, res, next) => {

        if (NODE_ENV === "development") {

            console.log(
                `${req.method} ${req.originalUrl}`
            );

        }

        next();

    }
);

/*
 * Routes
 */
app.use(
    "/",
    router
);

/*
 * 404 Handler
 */
app.use(
    (req, res, next) => {

        const err =
            new Error(
                "Page Not Found"
            );

        err.status = 404;

        next(err);

    }
);

/*
 * Global Error Handler
 */
app.use(errorHandler);

/*
 * Start Server
 */
app.listen(
    PORT,
    async () => {

        try {

            await testConnection();

            console.log("Database connected");
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${NODE_ENV}`);

        } catch (err) {

            console.error(
                "Database connection failed:",
                err
            );

        }

    }
);