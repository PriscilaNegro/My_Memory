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

    const statusCode =
        res.statusCode && res.statusCode !== 200 ? res.statusCode : 400;

    res.status(statusCode).json({
        title: err.title || error_titles[statusCode] || "Erro",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};