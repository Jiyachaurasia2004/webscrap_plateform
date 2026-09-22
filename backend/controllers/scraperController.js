const { scrapeWebsite } = require("../services/scraperService");
const ScrapedData = require("../models/ScrapedData");

const scrape = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Validate URL
    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }

    // Only HTTP/HTTPS
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed",
      });
    }

    const scraped = await scrapeWebsite(parsedUrl.href);

    const savedData = await ScrapedData.create({
      user: req.userId,
      url: parsedUrl.href,
      title: scraped.title,
      description: scraped.description,
      headings: scraped.headings,
      paragraphs: scraped.paragraphs,
      links: scraped.links,
      images: scraped.images,
    });

    res.status(201).json({
      success: true,
      message: "Website scraped successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Scraper Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Scraping failed",
    });
  }
};
const getScrapedData = async (req, res) => {
  try {
    const data = await ScrapedData.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get Scraped Data Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scraped data",
    });
  }
};
const deleteScrapedData = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedData = await ScrapedData.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: "Scraped data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scraped data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Scraped Data Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete scraped data",
    });
  }
};
module.exports = {
  scrape,
  getScrapedData,
  deleteScrapedData,
};