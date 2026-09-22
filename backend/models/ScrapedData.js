const mongoose = require("mongoose");

const scrapedDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    headings: [
      {
        type: String,
      },
    ],

    paragraphs: [
      {
        type: String,
      },
    ],

    links: [
      {
        text: String,
        url: String,
      },
    ],

    images: [
      {
        alt: String,
        url: String,
      },
    ],

    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScrapedData", scrapedDataSchema);