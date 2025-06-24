import express from "express";
import cors from "cors";
import newsRoutes from "./routes/newsAPI/newsAPI.js";
import newsScrappingRoutes from "./routes/newsScapping/scrapper.js";
import innovationRouter from "./routes/newsScapping/BBCInnovation.js";
import sportRoute from "./routes/newsScapping/BBCSport.js";
import newsRouter from "./routes/newsScapping/BBCNews.js";
import analyticsRoute from "./routes/analytics/analytics.js"
import { startTelegramBot } from "./bots/telegramBot.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//app.use("/api/news", newsRoutes);
app.use("/api/scrape", newsScrappingRoutes);
app.use("/api/scrape/innovation", innovationRouter);
app.use("/api/scrape/sport", sportRoute);
app.use("/api/scrape/news", newsRouter);
app.use("/api/analytics", analyticsRoute);

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
