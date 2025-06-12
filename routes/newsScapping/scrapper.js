const express = require("express");
const router = express.Router();

const {
  scrapeBBCNews,
  scrapeCNNHealth,
  scrapeTechCrunch,
} = require("../../services/newsScrapping");

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

module.exports = router;
