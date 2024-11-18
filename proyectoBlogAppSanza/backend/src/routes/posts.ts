import express from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import asyncHandler from "../utils/asyncHandler";

const postRoutes = express.Router();

const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

postRoutes.post(
  "/",
  authenticateToken,
  asyncHandler(async (req: any, res: any) => {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user.userId });
    await post.save();
    res.status(201).json(post);
  })
);

postRoutes.get(
  "/",
  asyncHandler(async (req: any, res: any) => {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  })
);

postRoutes.put(
  "/:id",
  authenticateToken,
  asyncHandler(async (req: any, res: any) => {
    const { title, content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId },
      { title, content },
      { new: true }
    );

    if (!post) {
      const error: any = new Error("Post not found or unauthorized");
      error.statusCode = 404;
      throw error;
    }

    res.json(post);
  })
);

postRoutes.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req: any, res: any) => {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId,
    });

    if (!post) {
      const error: any = new Error("Post not found or unauthorized");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "Post deleted successfully" });
  })
);

export default postRoutes;
