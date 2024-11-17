import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import errorHandler from "./middleware/errorHandler";
import { configureSecurityMiddleware } from "./middleware/security";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

configureSecurityMiddleware(app);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
