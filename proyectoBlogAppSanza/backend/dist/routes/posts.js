"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Post_1 = __importDefault(require("../models/Post"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const postRoutes = express_1.default.Router();
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
postRoutes.post("/", authenticateToken, (0, asyncHandler_1.default)(async (req, res) => {
    const { title, content } = req.body;
    const post = new Post_1.default({ title, content, author: req.user.userId });
    await post.save();
    res.status(201).json(post);
}));
postRoutes.get("/", (0, asyncHandler_1.default)(async (req, res) => {
    const posts = await Post_1.default.find().populate("author", "username");
    res.json(posts);
}));
postRoutes.put("/:id", authenticateToken, (0, asyncHandler_1.default)(async (req, res) => {
    const { title, content } = req.body;
    const post = await Post_1.default.findOneAndUpdate({ _id: req.params.id, author: req.user.userId }, { title, content }, { new: true });
    if (!post) {
        const error = new Error("Post not found or unauthorized");
        error.statusCode = 404;
        throw error;
    }
    res.json(post);
}));
postRoutes.delete("/:id", authenticateToken, (0, asyncHandler_1.default)(async (req, res) => {
    const post = await Post_1.default.findOneAndDelete({
        _id: req.params.id,
        author: req.user.userId,
    });
    if (!post) {
        const error = new Error("Post not found or unauthorized");
        error.statusCode = 404;
        throw error;
    }
    res.json({ message: "Post deleted successfully" });
}));
exports.default = postRoutes;
//# sourceMappingURL=posts.js.map