// models/User.js
import mongoose from "mongoose";
import { commandSchema } from "./commandSchema.js";

const userSchema = new mongoose.Schema({
  TelegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["BBCNews", "CNNHealth", "TechCrunch"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  totalArticlesRead: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
