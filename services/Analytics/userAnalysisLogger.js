import userAnalytics from "../../models/userAnalyticsSchema.js"

export const logUserCommand = async (userId, command) => {
  try {
    await userAnalytics.create({
      userId,
      eventType: "command_used",
      eventData: { command },
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("❗Error logging user command:", err.message);
  }
};

export const logUserArticleEvent = async (userId, type, article) => {
  try {
    await userAnalytics.create({
      userId,
      eventType: `article_${type}`,
      eventData: {
        title: article.title,
        url: article.url,
        category: article.category,
        source: article.source,
      },
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("❗Error logging user article event:", err.message);
  }
};

//Analysis functions

//Top 5 active users
export const getTopActiveUsers = async (limit = 5) => {
    try {
        return await userAnalytics
        .aggregate([
            {
            $group: {
                _id: "$userId",
                totalCommands: { $sum: { $cond: [{ $eq: ["$eventType", "command_used"] }, 1, 0] } },
                totalArticlesRead: { $sum: { $cond: [{ $eq: ["$eventType", "article_read"] }, 1, 0] } },
                totalArticlesSaved: { $sum: { $cond: [{ $eq: ["$eventType", "article_saved"] }, 1, 0] } },
            },
            },
            { $sort: { totalCommands: -1, totalArticlesRead: -1, totalArticlesSaved: -1 } },
            { $limit: limit },
        ])
        .exec();
    } catch (err) {
        console.error("❗Error fetching top active users:", err.message);
        return [];
    }
}

//Top 5 commands used
export const getTopCommands = async (limit = 5) => {
    try {
        return await userAnalytics
        .aggregate([
            {
            $match: { eventType: "command_used" },
            },
            {
            $group: {
                _id: "$eventData.command",
                count: { $sum: 1 },
            },
            },
            { $sort: { count: -1 } },
            { $limit: limit },
        ])
        .exec();
    } catch (err) {
        console.error("❗Error fetching top commands:", err.message);
        return [];
    }
}

//user saved articles
export const getUserSavedArticles = async (userId) => {
    try {
        return await userAnalytics
        .find({ userId, eventType: "article_saved" })
        .select("eventData")
        .lean();
    } catch (err) {
        console.error("❗Error fetching user saved articles:", err.message);
        return [];
    }
}