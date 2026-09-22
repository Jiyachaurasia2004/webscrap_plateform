const axios = require("axios");

const searchGoogle = async (query) => {
  try {
    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google",
          q: query,
          api_key: process.env.SERPAPI_KEY,
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "SerpApi Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to fetch Google search results");
  }
};

module.exports = {
  searchGoogle,
};