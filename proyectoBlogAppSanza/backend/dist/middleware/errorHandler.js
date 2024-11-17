"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("../models/Error"));
const errorHandler = async (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message;
    try {
        await Error_1.default.create({
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            statusCode: statusCode,
        });
    }
    catch (logError) {
        console.error("Failed to log error to database:", logError);
    }
    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode,
        },
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map