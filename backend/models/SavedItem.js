const mongoose = require("mongoose");

const savedItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    link: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },

    displayedLink: {
      type: String,
      default: "",
      maxlength: 2048,
    },

    snippet: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    thumbnail: {
      type: String,
      default: "",
      maxlength: 2048,
    },

    sourceQuery: {
      type: String,
      default: "",
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Same user cannot save same URL twice
savedItemSchema.index(
  { user: 1, link: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "SavedItem",
  savedItemSchema
);