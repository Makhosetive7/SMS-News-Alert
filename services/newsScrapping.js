const axios = require('axios');
const cheerio = require('cheerio');


// BBC Tech
const scrapeBBCNews = async () => {
  const { data } = await axios.get("https://www.bbc.com/news/technology");
  const $ = cheerio.load(data);
  const articles = [];

  $(".gs-c-promo-heading").each((_, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");
    articles.push({
      source: "BBC",
      category: "Technology",
      title,
      link: link.startsWith("http") ? link : `https://www.bbc.com${link}`,
    });
  });

  return articles.slice(0, 10);
};

// CNN Health
const scrapeCNNHealth = async () => {
  const { data } = await axios.get("https://edition.cnn.com/health");
  const $ = cheerio.load(data);
  const articles = [];

  $("h3.cd__headline a").each((_, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");
    articles.push({
      source: "CNN",
      category: "Health",
      title,
      link: link.startsWith("http") ? link : `https://edition.cnn.com${link}`,
    });
  });

  return articles.slice(0, 10);
};

// TechCrunch Startups
const scrapeTechCrunch = async () => {
  const { data } = await axios.get("https://techcrunch.com/startups/");
  const $ = cheerio.load(data);
  const articles = [];

  $("a.post-block__title__link").each((_, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");
    articles.push({
      source: "TechCrunch",
      category: "Startups",
      title,
      link,
    });
  });

  return articles.slice(0, 10);
};

module.exports = {
  scrapeBBCNews,
  scrapeCNNHealth,
  scrapeTechCrunch,
};