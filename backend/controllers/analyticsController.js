const SearchHistory = require("../models/SearchHistory");
const ScrapedData = require("../models/ScrapedData");

const getAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    const totalSearches = await SearchHistory.countDocuments({
      user: userId,
    });

    const totalScraped = await ScrapedData.countDocuments({
      user: userId,
    });

    const recentSearches = await SearchHistory.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("query resultCount searchedAt createdAt");

    const recentScraped = await ScrapedData.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("url title scrapedAt createdAt");

    // Search activity for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailySearches = await SearchHistory.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalSearches,
        totalScraped,
        recentSearches,
        recentScraped,
        dailySearches,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};