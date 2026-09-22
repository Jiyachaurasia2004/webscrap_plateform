const { searchGoogle } = require("../services/searchService");
const SearchHistory = require("../models/SearchHistory");

const search = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const cleanQuery = query.trim();

    const data = await searchGoogle(cleanQuery);

    const results = (data.organic_results || []).map((item) => ({
      position: item.position,
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayedLink: item.displayed_link,
      thumbnail: item.thumbnail || null,
    }));

    // Save search history
    await SearchHistory.create({
      user: req.userId,
      query: cleanQuery,
      resultCount: results.length,
    });

    res.status(200).json({
      success: true,
      query: cleanQuery,
      totalResults: results.length,
      results,
    });
  } catch (error) {
    console.error("Search Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

module.exports = {
  search,
};