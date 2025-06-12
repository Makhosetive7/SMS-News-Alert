import axios from "axios";


const API_KEY = process.env.NEWS_API_KEY; 

const BASE_URL = "https://newsapi.org/v2";
// const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${API_KEY}";

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

export default getTopHeadlines;
