import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import newsRoutes from "./routes/newsAPI/newsAPI.js";
import newsScrappingRoutes from "./routes/newsScapping/scrapper.js";
import { startTelegramBot } from "./bots/telegramBot.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/scrape", newsScrappingRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;

  startTelegramBot();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:5000`)
  );
});

// Start Telegram Bot
startTelegramBot();

export default app;
