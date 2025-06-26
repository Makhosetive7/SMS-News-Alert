// models/User.js
import mongoose from "mongoose";

const telegramUsersSchema = new mongoose.Schema({
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
    enum: ["admin", "telegramUser"],
    default: "telegramUser",
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

export default mongoose.model("telegramUser", telegramUsersSchema);
