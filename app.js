const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsAPI/newsAPI");
const newsScrappingRoutes = require("./routes/newsScapping/scrapper");
const startTelegramBot = require("./bots/telegramBot");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/scrape", newsScrappingRoutes);


// Start Telegram Bot
startTelegramBot();


module.exports = app;
