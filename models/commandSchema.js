import mongoose from "mongoose";

export const commandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  category: {
    type: String,
    required: false,
    enum: ["news", "sports", "innovation"],
    default: "news",
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commandSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Command = mongoose.model("Command", commandSchema);
