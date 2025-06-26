import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import newsScrappingRoutes from "./routes/newsScapping/scrapper.js";
import innovationRouter from "./routes/newsScapping/BBCInnovation.js";
import sportRoute from "./routes/newsScapping/BBCSport.js";
import newsRouter from "./routes/newsScapping/BBCNews.js";
import analyticsRoute from "./routes/analytics/analytics.js";
import adminRoutes from "./routes/adminUserRoutes/adminUser.js";
import { startTelegramBot } from "./bots/telegramBot.js";
import connectDB from "./config/database.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/scrape", newsScrappingRoutes);
app.use("/api/scrape/innovation", innovationRouter);
app.use("/api/scrape/sport", sportRoute);
app.use("/api/scrape/news", newsRouter);
app.use("/api/analytics", analyticsRoute);
app.use("/api/auth/admin", adminRoutes);

// Ensure JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in the .env file");
   

  process.exit(1);
}

// Start DB and Server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );

  startTelegramBot(); 
});

export default app;
