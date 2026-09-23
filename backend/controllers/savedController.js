const mongoose = require("mongoose");
const SavedItem = require("../models/SavedItem");

const saveItem = async (req, res) => {
  try {
    const {
      title,
      link,
      displayedLink,
      snippet,
      thumbnail,
      sourceQuery,
    } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!link || typeof link !== "string") {
      return res.status(400).json({
        success: false,
        message: "Result URL is required",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(link);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid result URL",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed",
      });
    }

    const existingItem = await SavedItem.findOne({
      user: req.userId,
      link: parsedUrl.href,
    });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "This item is already saved",
        data: existingItem,
      });
    }

    const savedItem = await SavedItem.create({
      user: req.userId,
      title: title.trim(),
      link: parsedUrl.href,
      displayedLink:
        typeof displayedLink === "string"
          ? displayedLink.trim()
          : "",
      snippet:
        typeof snippet === "string"
          ? snippet.trim()
          : "",
      thumbnail:
        typeof thumbnail === "string"
          ? thumbnail.trim()
          : "",
      sourceQuery:
        typeof sourceQuery === "string"
          ? sourceQuery.trim()
          : "",
    });

    return res.status(201).json({
      success: true,
      message: "Item saved successfully",
      data: savedItem,
    });
  } catch (error) {
    console.error("Save Item Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This item is already saved",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save item",
    });
  }
};

const getSavedItems = async (req, res) => {
  try {
    const items = await SavedItem.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get Saved Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch saved items",
    });
  }
};

const deleteSavedItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid saved item ID",
      });
    }

    const deletedItem =
      await SavedItem.findOneAndDelete({
        _id: id,
        user: req.userId,
      });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Saved item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Saved item removed",
    });
  } catch (error) {
    console.error("Delete Saved Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove saved item",
    });
  }
};

module.exports = {
  saveItem,
  getSavedItems,
  deleteSavedItem,
};