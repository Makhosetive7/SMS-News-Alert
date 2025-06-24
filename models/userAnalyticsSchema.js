import mongoose from "mongoose";

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  eventType: {
    type: String,
    enum: ["article_read", "article_saved", "command_used"],
    required: true,
  },
  eventData: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("userAnalytics", userAnalyticsSchema);
