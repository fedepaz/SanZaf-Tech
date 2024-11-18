"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const errorSchema = new mongoose_1.default.Schema({
    message: String,
    stack: String,
    timestamp: { type: Date, default: Date.now },
    path: String,
    method: String,
    statusCode: Number,
}, { timestamps: true });
exports.default = mongoose_1.default.model("Error", errorSchema);
//# sourceMappingURL=Error.js.map