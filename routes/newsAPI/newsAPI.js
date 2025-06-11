const express = require('express');
const router = express.Router();
const { getTopHeadlines } = require('../../services/newsAPI');

router.get('/top-headlines', async (req, res) => {
  const { country = 'us', category = 'general' } = req.query;

  try {
    const articles = await getTopHeadlines(country, category);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    res.status(500).json({ error: 'Failed to fetch top headlines' });
  }
}
);

module.exports = router;