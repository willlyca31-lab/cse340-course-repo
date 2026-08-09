import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";
import session from "express-session";
import flash from "./src/middleware/flash.js";

// =========================
// Environment
// =========================

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() || "production";

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

// =========================
// File paths
// =========================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// =========================
// Session
// =========================

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000,
        },
    }),
);

app.use((req, res, next) => {
    res.locals.isLoggedIn = false;

    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.NODE_ENV = NODE_ENV;

    next();
});

// =========================
// Flash messages
// =========================

app.use(flash);

// =========================
// Body parsing
// =========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =========================
// Static files
// =========================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// =========================
// View engine
// =========================

app.set("view engine", "ejs");
app.set(
    "views",
    path.join(__dirname, "src/views")
);

// =========================
// Request logging
// =========================

app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
        console.log("Session user:", req.session.user || "Not logged in");
    }

    next();
});

// =========================
// Routes
// =========================

app.use(router);

// =========================
// 404
// =========================

app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.status = 404;

    next(err);
});

// =========================
// Start server
// =========================

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