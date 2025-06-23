import express from 'express';
import { 
  scrapeBBCNews,
  scrapeBBCNewsInnovation,
  scrapeBBCNewsSport 
} from "../../services/newsScrapping.js";

const router = express.Router();

router.get("/scrapedNews", async (req, res) => {
  try {
    const [news, sport, innovation] = await Promise.all([
      scrapeBBCNews(),
      scrapeBBCNewsSport(),
      scrapeBBCNewsInnovation()
    ]);

    res.json({
      bbcNews: news,
      bbcSport: sport,
      bbcInnovation: innovation
    });
  } catch (error) {
    console.error('Combined scraping error:', error);
    res.status(500).json({ 
      error: "Failed to scrape news from sources.",
      details: error.message 
    });
  }
});

router.get("/sport", async (req, res) => {
  try {
    const sportNews = await scrapeBBCNewsSport();
    res.json(sportNews);
  } catch (error) {
    console.error('Sport scraping error:', error);
    res.status(500).json({ 
      error: "Failed to scrape BBC News Sport.",
      details: error.message 
    });
  }
});

router.get("/innovation", async (req, res) => {
  try {
    const innovationNews = await scrapeBBCNewsInnovation();
    res.json(innovationNews);
  } catch (error) {
    console.error('Innovation scraping error:', error);
    res.status(500).json({ 
      error: "Failed to scrape BBC News Innovation.",
      details: error.message 
    });
  }
});

export default router;