import { http_status_codes, error_titles } from "../constants.js";

// 404 handler
export const notFound = (req, res, next) => {
    res.status(http_status_codes.NOT_FOUND);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
};

// General error handler
export const errorHandler = (err, req, res, next) => {
    console.log("Middleware de erro ativado:", err.message);
    const statusCode = res.statusCode
        ? res.statusCode
        : http_status_codes.SERVER_ERROR;

    const title = error_titles[statusCode];

    if (title) {
        res.status(statusCode).json({
            title,
            message: err.message,
            stackTrace: err.stack,
        });
    } else {
        console.log("All good");
        next(); // em caso de outro handler, manda outro next
    }
};