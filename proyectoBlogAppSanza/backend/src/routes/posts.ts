import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Post from "../models/Post";

const postRoutes = express.Router();

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = decoded as CustomJwtPayload;
    next();
  });
};

postRoutes.post(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const post = new Post({ title, content, author: req.user?.userId });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  }
);

postRoutes.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

postRoutes.put(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, content } = req.body;
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id, author: req.user?.userId },
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
  }
);

postRoutes.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        author: req.user?.userId,
      });
      if (!post) {
        res.status(404).json({ error: "Post not found or unauthorized" });
        return;
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

export default postRoutes;
