import mongoose from "mongoose";

const errorSchema = new mongoose.Schema(
  {
    message: String,
    stack: String,
    timestamp: { type: Date, default: Date.now },
    path: String,
    method: String,
    statusCode: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Error", errorSchema);
