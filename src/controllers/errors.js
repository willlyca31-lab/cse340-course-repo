/*
 * Log every request
 */
const logRequest = (req, res, next) => {

    if (process.env.NODE_ENV === "development") {

        console.log(`${req.method} ${req.url}`);

    }

    next();

};

/*
 * Make NODE_ENV available to every view
 */
const setEnvironment = (req, res, next) => {

    res.locals.NODE_ENV =
        process.env.NODE_ENV || "development";

    next();

};

/*
 * Test 500 Error
 */
const testErrorPage = (req, res, next) => {

    const err = new Error("This is a test error");

    err.status = 500;

    next(err);

};

/*
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {

    console.error("Error occurred:", err.message);
    console.error("Stack trace:", err.stack);

    const status = err.status || 500;

    const template =
        status === 404
            ? "404"
            : "500";

    res.status(status).render(`errors/${template}`, {

        title:
            status === 404
                ? "Page Not Found"
                : "Server Error",

        error: err.message,

        stack: err.stack,

        NODE_ENV:
            process.env.NODE_ENV || "development"

    });

};

export {

    logRequest,

    setEnvironment,

    testErrorPage,

    errorHandler

};