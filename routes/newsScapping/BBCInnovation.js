import express from 'express';
import  {scrapeBBCNewsInnovation}  from '../../services/NewsScrapping/BBCInnovation.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const innovationNews = await scrapeBBCNewsInnovation();
        res.json(innovationNews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape BBC News Innovation.' });
    }
}
);

export default router;