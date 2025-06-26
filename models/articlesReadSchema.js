import mongoose from "mongoose";

const articlesReadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "telegramUser",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: false,
    trim: true,
  },
  category: {
    type: String,
    enum: ["news", "sports", "innovation"],
    required: false,
  },
  source: {
    type: String,
    enum: [
      "World",
      "Middle East",
      "US & Canada",
      "Future",
      "Football",
      "Europe",
      "Africa",
      "Asia",
      "Culture",
      "Technology",
      "BBCNews",
      "Business",
      "Arts",
      "Health",
      "Science",
      "sport",
        "Politics",
      "Glasgow & West Scotland`",
      "Travel",
    ],
    required: false,
  },
  readTime: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("articlesRead", articlesReadSchema);
