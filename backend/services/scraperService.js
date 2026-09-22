const axios = require("axios");
const cheerio = require("cheerio");

const scrapeWebsite = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 15000,

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },

      maxContentLength: 5 * 1024 * 1024,
      maxBodyLength: 5 * 1024 * 1024,
    });

    const $ = cheerio.load(response.data);

    // Remove unnecessary elements
    $("script, style, noscript, iframe").remove();

    // Title
    const title = $("title").first().text().trim();

    // Description
    const description =
      $('meta[name="description"]').attr("content")?.trim() || "";

    // Headings
    const headings = [];

    $("h1, h2, h3").each((index, element) => {
      const text = $(element).text().replace(/\s+/g, " ").trim();

      if (text) {
        headings.push(text);
      }
    });

    // Paragraphs
    const paragraphs = [];

    $("p").each((index, element) => {
      const text = $(element).text().replace(/\s+/g, " ").trim();

      if (text) {
        paragraphs.push(text);
      }
    });

    // Links
    const links = [];

    $("a[href]").each((index, element) => {
      const text = $(element).text().replace(/\s+/g, " ").trim();
      const href = $(element).attr("href");

      if (href) {
        try {
          const absoluteUrl = new URL(href, url).href;

          links.push({
            text,
            url: absoluteUrl,
          });
        } catch (error) {
          // Ignore invalid URLs
        }
      }
    });

    // Images
    const images = [];

    $("img[src]").each((index, element) => {
      const src = $(element).attr("src");
      const alt = $(element).attr("alt") || "";

      if (src) {
        try {
          const absoluteUrl = new URL(src, url).href;

          images.push({
            alt,
            url: absoluteUrl,
          });
        } catch (error) {
          // Ignore invalid image URLs
        }
      }
    });

    return {
      title,
      description,
      headings,
      paragraphs,
      links,
      images,
    };
} catch (error) {
  console.error(
    "Scraping error:",
    error.response?.status || error.message
  );

  throw new Error("Unable to scrape this webpage");
}
};

module.exports = {
  scrapeWebsite,
};