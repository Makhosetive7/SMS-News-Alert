import mongoose from "mongoose";

const articleAnalysisSchema = new mongoose.Schema({
  articleUrl: { type: String, required: true, unique: true },
  title: {
    type: String,
  },
  category: {
    type: String,
    enum: ["news", "sports", "innovation"],
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
      "Travel",
      "Politics",
      "Glasgow & West Scotland`",
    ],
  },
  totalReads: { type: Number, default: 0 },
  totalSaves: { type: Number, default: 0 },
  lastReadAt: Date,
  lastSavedAt: Date,
});


export default mongoose.model("articleAnalysis", articleAnalysisSchema);
