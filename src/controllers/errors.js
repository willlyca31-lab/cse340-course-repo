/*
 * Error handling controller
 */


/*
 * Log every request
 */
const logRequest = (req, res, next) => {

    console.log(
        `${req.method} ${req.url}`
    );

    next();

};



/*
 * Set environment variables for views
 */
const setEnvironment = (req, res, next) => {

    res.locals.environment =
        process.env.NODE_ENV;

    next();

};



/*
 * Test error page
 * Used by /test-error route
 */
const testErrorPage = (req, res, next) => {

    const error = new Error(
        "This is a test error"
    );

    error.status = 500;

    next(error);

};



/*
 * 404 Error Handler
 */
const handle404 = (req, res, next) => {

    const err = new Error(
        "Page Not Found"
    );

    err.status = 404;

    next(err);

};



/*
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {

    const status =
        err.status || 500;


    console.error(err);


    res.status(status).render(
        "error",
        {
            title: status === 404
                ? "Page Not Found"
                : "Server Error",

            message:
                err.message
        }
    );

};



export {
    logRequest,
    setEnvironment,
    testErrorPage,
    handle404,
    errorHandler
};