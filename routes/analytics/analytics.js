import express from "express";
import {
  getTopReadArticles,
  getTopSavedArticles,
  getTopSavedCategories,
  getTopSavedSources,
} from "../../services/Analytics/articleAnalysisLogger.js";

import {
  getTopActiveUsers,
  getTopCommands,
  getUserSavedArticles,
} from "../../services/Analytics/userAnalysisLogger.js";
import adminUser from "../adminUserRoutes/adminUser.js"
import {adminAuthMiddleware} from "../../middleWare/authMiddleware.js"

const router = express.Router();

//Top 5 Most Read Articles
router.get("/top-read", adminAuthMiddleware, async (req, res) => {
  try {
    const data = await getTopReadArticles();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch top read articles" });
  }
});

//Top 5 Most Saved Articles
router.get("/top-saved", adminAuthMiddleware, async (req, res) => {
  try {
    const data = await getTopSavedArticles();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch top saved articles" });
  }
});

//Top 5 Categories
router.get("/top-categories",adminAuthMiddleware, async (req, res) => {
  try {
    const data = await getTopSavedCategories();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

//Top 5 Sources
router.get("/top-sources",adminAuthMiddleware, async (req, res) => {
  try {
    const data = await getTopSavedSources();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch sources" });
  }
});

//Top 5 Active Users
router.get("/top-users", adminAuthMiddleware,async (req, res) => {
  try {
    const data = await getTopActiveUsers();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch top users" });
  }
});

//Top Commands Used
router.get("/top-commands",adminAuthMiddleware,  async (req, res) => {
  try {
    const data = await getTopCommands();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch commands" });
  }
});

//Get a User's Saved Articles
router.get("/user-saved/:userId",adminAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await getUserSavedArticles(userId);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch user saved articles" });
  }
});

export default router;
