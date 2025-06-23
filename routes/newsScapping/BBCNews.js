import express from "express";
import  {scrapeBBCNews}  from "../../services/newsScrapping.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const news = await scrapeBBCNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape news from BBC News." });
  }
});


export default router;