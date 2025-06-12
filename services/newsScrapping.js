import axios from "axios";
import puppeteer from "puppeteer";


// BBC Tech
const scrapeBBCNews = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://www.bbc.com/news', { waitUntil: 'networkidle2' });

  const articles = await page.$$eval(
    '[data-testid^="london-card"], [data-testid^="dundee-card"], [data-testid^="manchester-card"], [data-testid^="liverpool-card"]',
    (cards) => cards.map(card => {
      const getText = (selector) => 
        card.querySelector(selector)?.textContent.trim() || null;
      
      const getAttr = (selector, attr) =>
        card.querySelector(selector)?.getAttribute(attr) || null;

      return {
        title: getText('[data-testid="card-headline"]'),
        description: getText('[data-testid="card-description"]'),
        url: getAttr('a[data-testid="internal-link"]', 'href'),
        timestamp: getText('[data-testid="card-metadata-lastupdated"]'),
        category: getText('[data-testid="card-metadata-tag"]'),
        image: getAttr('[data-testid="card-media"] img', 'src'),
        hasVideo: !!card.querySelector('[data-testid="content-type-icon-wrapper"]')
      };
    })
  );

  await browser.close();
  return articles.filter(a => a.title && a.url);
};

// CNN Health
const scrapeCNNHealth = async () => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://edition.cnn.com/health", {
      waitUntil: "networkidle2",
    });

    const articles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h3.cd__headline")).map(
        (el) => ({
          source: "CNN",
          category: "Health",
          title: el.innerText,
          link: el.querySelector("a").href,
        })
      );
    });
    return articles.slice(0, 10);
  } catch (error) {
    console.error("Error scraping CNN Health:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// TechCrunch Startups
const scrapeTechCrunch = async () => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://techcrunch.com/startups/", {
      waitUntil: "networkidle2",
    });

    const articles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h2.post-block__title")).map(
        (el) => ({
          source: "TechCrunch",
          category: "Startups",
          title: el.innerText,
          link: el.querySelector("a").href,
        })
      );
    });
    return articles.slice(0, 10);
  } catch (error) {
    console.error("Error scraping TechCrunch:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export { scrapeBBCNews, scrapeCNNHealth, scrapeTechCrunch };
