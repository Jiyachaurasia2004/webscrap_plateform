const SearchHistory = require("../models/SearchHistory");

const getSearchHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find({
      user: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error(
      "Search History Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
    });
  }
};

const deleteSearchHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SearchHistory.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Search history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Search history deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete History Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete search history",
    });
  }
};

module.exports = {
  getSearchHistory,
  deleteSearchHistory,
};