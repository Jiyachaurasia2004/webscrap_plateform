const ScrapedData = require("../models/ScrapedData");
const { Parser } = require("json2csv");

const getUserScrapedData = async (userId) => {
  return await ScrapedData.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

// ================= JSON EXPORT =================

const exportJSON = async (req, res) => {
  try {
    const data = await getUserScrapedData(req.userId);

    const cleanData = data.map((item) => ({
      id: item._id,
      url: item.url,
      title: item.title,
      description: item.description,
      headings: item.headings,
      paragraphs: item.paragraphs,
      links: item.links,
      images: item.images,
      scrapedAt: item.createdAt,
    }));

    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="scraped-data.json"'
    );

    res.status(200).send(
      JSON.stringify(cleanData, null, 2)
    );
  } catch (error) {
    console.error(
      "JSON Export Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to export JSON",
    });
  }
};

// ================= CSV EXPORT =================

const exportCSV = async (req, res) => {
  try {
    const data = await getUserScrapedData(req.userId);

    const cleanData = data.map((item) => ({
      id: item._id.toString(),
      url: item.url,
      title: item.title,
      description: item.description,
      headings: item.headings.join(" | "),
      paragraphs: item.paragraphs.join(" | "),
      links: item.links
        .map((link) => link.url)
        .join(" | "),
      images: item.images
        .map((image) => image.url)
        .join(" | "),
      scrapedAt: item.createdAt,
    }));

    const fields = [
      "id",
      "url",
      "title",
      "description",
      "headings",
      "paragraphs",
      "links",
      "images",
      "scrapedAt",
    ];

    const parser = new Parser({
      fields,
    });

    const csv = parser.parse(cleanData);

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="scraped-data.csv"'
    );

    res.status(200).send(csv);
  } catch (error) {
    console.error(
      "CSV Export Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to export CSV",
    });
  }
};

module.exports = {
  exportJSON,
  exportCSV,
};