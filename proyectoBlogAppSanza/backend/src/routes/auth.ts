import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  asyncHandler(async (req: any, res: any) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const error: any = new Error("Username or email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  })
);

authRoutes.post(
  "/login",
  asyncHandler(async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Logged in successfully" });
  })
);
authRoutes.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

authRoutes.get("/status", (req, res) => {
  res.json({ isLoggedIn: !!req.cookies.token });
});

export default authRoutes;
