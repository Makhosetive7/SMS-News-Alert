import express from "express";
import { scrapeBBCNews, scrapeCNNHealth, scrapeTechCrunch } from "../../services/newsScrapping.js";

const router = express.Router();


router.get("/scrapedNews", async (req, res) => {
  try {
    const [bbc, cnn, techcrunch] = await Promise.all([
      scrapeBBCNews(),
      scrapeCNNHealth(),
      scrapeTechCrunch(),
    ]);

    res.json([...(bbc || []), ...(cnn || []), ...(techcrunch || [])]);
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape news from sources." });
  }
});

export default router;
