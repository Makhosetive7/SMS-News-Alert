import mongoose from "mongoose";

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
  command: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
    enum: ["BBCNews", "CNNHealth", "TechCrunch"],
  },
  role: {
    type: String,
    required: false,
    enum: ["admin", "user"],
    default: "user",
  },
  totalArticlesRead: {
    type: Number,
    default: 0, 
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

export default mongoose.model("User", userSchema);
