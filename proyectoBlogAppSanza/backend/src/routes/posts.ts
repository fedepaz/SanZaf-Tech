import express from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";

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

postRoutes.post("/", authenticateToken, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user.userId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

postRoutes.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

postRoutes.put("/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId },
      { title, content },
      { new: true }
    );
    if (!post) {
      res.status(404).json({ error: "Post not found or unauthorized" });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

postRoutes.delete("/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId,
    });
    if (!post) {
      res.status(404).json({ error: "Post not found or unauthorized" });
      return;
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default postRoutes;
