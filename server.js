import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import router from "./src/routes.js";
import { testConnection } from "./src/models/db.js";
import {
    logRequest,
    setEnvironment,
    handle404,
    errorHandler
} from "./src/controllers/errors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoryRoutes = require("./routes/categoryRoutes");
app.use(categoryRoutes);


/*
 * Static Files
 */
app.use(express.static(path.join(__dirname, "public")));

/*
 * View Engine
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

/*
 * Middleware
 */
app.use(logRequest);
app.use(setEnvironment);

/*
 * Routes
 */
app.use(router);

/*
 * 404 Handler
 */
app.use(handle404);

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

        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    } catch (err) {
        console.error(err);
    }
});