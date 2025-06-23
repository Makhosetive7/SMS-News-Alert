import  {scrapeBBCNewsSport}  from "../../services/NewsScrapping/BBCSport.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const news = await scrapeBBCNewsSport();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape news from sources." });
  }
});

export default router;
