import articleAnalysis from "../../models/articleAnalysisSchema.js";

export const updateArticleStats = async (article, action) => {
  const update = {
    ...(action === "read" && { totalReads: 1, lastReadAt: new Date() }),
    ...(action === "save" && { totalSaves: 1, lastSavedAt: new Date() }),
  };

  try {
    await articleAnalysis.findOneAndUpdate(
      { articleUrl: article.url },
      {
        $setOnInsert: {
          title: article.title,
          category: article.category,
          source: article.source,
          articleUrl: article.url,
        },
        $inc: {
          totalReads: update.totalReads || 0,
          totalSaves: update.totalSaves || 0,
        },
        ...(update.lastReadAt && { lastReadAt: update.lastReadAt }),
        ...(update.lastSavedAt && { lastSavedAt: update.lastSavedAt }),
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("❗Error updating article stats:", err.message);
  }
};

//Analsis Functions

//top 5 read articles
export const getTopReadArticles = async (limit = 5) => {
  try {
    return await articleAnalysis
      .find()
      .sort({ totalReads: -1 })
      .limit(limit)
      .select("title articleUrl totalReads lastReadAt")
      .lean();
  } catch (err) {
    console.error("❗Error fetching top read articles:", err.message);
    return [];
  }
};

//top 5 saved articles
export const getTopSavedArticles = async (limit = 5) => {
  try {
    return await articleAnalysis
      .find()
      .sort({ totalSaves: -1 })
      .limit(limit)
      .select("title articleUrl totalSaves lastSavedAt")
      .lean();
  } catch (err) {
    console.error("❗Error fetching top saved articles:", err.message);
    return [];
  }
};

//top 5 categories
export const getTopSavedCategories = async (limit = 5) => {
  try {
    return await articleAnalysis.aggregate([
      {
        $group: {
          _id: "$category",
          reads: { $sum: "$totalReads" },
          saves: { $sum: "$totalSaves" },
        },
      },
      { $sort: { reads: -1 } },
    ])
    .exec();
  } catch (err) {
    console.error("❗Error fetching top saved categories:", err.message);
    return [];
  }
};

//top 5 sources
export const getTopSavedSources = async (limit = 5) => {
    try {
        return await articleAnalysis.aggregate([
        {
            $group: {
            _id: "$source",
            reads: { $sum: "$totalReads" },
            saves: { $sum: "$totalSaves" },
            },
        },
        { $sort: { reads: -1 } },
        ])
        .exec();
    } catch (err) {
        console.error("❗Error fetching top saved sources:", err.message);
        return [];
    }

}


