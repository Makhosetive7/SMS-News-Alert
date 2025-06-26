import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema({
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
    required: true,
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
        "Politics",
      "Glasgow & West Scotland`",
      "sport",
      "Travel",
    ],
    required: false,
  },
  category: {
    type: String,
    enum: ["news", "sports", "innovation"],
    required: false,
  },
  savedAt: { type: Date, default: Date.now },
});

export default mongoose.model("savedArticles", savedArticleSchema);
