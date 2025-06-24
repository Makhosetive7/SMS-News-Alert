import mongoose from "mongoose";

export const articlesReadSchema = new mongoose.Schema({
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
        enum: ["BBCNews", "CNNHealth", "TechCrunch"],
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
})


const ArticlesRead = mongoose.model("ArticlesRead", articlesReadSchema);
