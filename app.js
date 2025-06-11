const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsAPI/newsAPI");
const newsScrappingRoutes = require("./routes/newsScapping/scrapper");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/news", newsRoutes);
app.use("/api/scrape", newsScrappingRoutes);


module.exports = app;
