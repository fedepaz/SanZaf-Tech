"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSecurityMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const configureSecurityMiddleware = (app) => {
    app.use((0, helmet_1.default)());
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
    });
    app.use(limiter);
    const corsOptions = {
        origin: process.env.NODE_ENV === "production"
            ? ["https://your-frontend-domain.vercel.app"]
            : "http://localhost:3000",
        credentials: true,
        optionsSuccessStatus: 200,
    };
    app.use((0, cors_1.default)(corsOptions));
};
exports.configureSecurityMiddleware = configureSecurityMiddleware;
//# sourceMappingURL=security.js.map