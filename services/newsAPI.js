const axios = require("axios");
const API_KEY = "3f66110531694da3b94ea712d96d21ce";

const BASE_URL = "https://newsapi.org/v2";
// const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=3f66110531694da3b94ea712d96d21ce";

//Fetching top headlines
const getTopHeadlines = async (country = "us", category = "general") => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines?country=us&category=general`, {
      params: {
        country,
        category,
        apiKey: API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    throw error;
  }
};

module.exports = {
  getTopHeadlines,
};
