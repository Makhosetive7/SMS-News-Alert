
import puppeteer from "puppeteer";

// BBC News Home
export const scrapeBBCNews = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.bbc.com/news", { waitUntil: "networkidle2" });

  const articles = await page.$$eval(
    '[data-testid^="london-card"], [data-testid^="dundee-card"], [data-testid^="manchester-card"], [data-testid^="liverpool-card"]',
    (cards) =>
      cards.map((card) => {
        const getText = (selector) =>
          card.querySelector(selector)?.textContent.trim() || null;

        const getAttr = (selector, attr) =>
          card.querySelector(selector)?.getAttribute(attr) || null;

        return {
          title: getText('[data-testid="card-headline"]'),
          description: getText('[data-testid="card-description"]'),
          url: getAttr('a[data-testid="internal-link"]', "href"),
          timestamp: getText('[data-testid="card-metadata-lastupdated"]'),
          category: getText('[data-testid="card-metadata-tag"]'),
          image: getAttr('[data-testid="card-media"] img', "src"),
          hasVideo: !!card.querySelector(
            '[data-testid="content-type-icon-wrapper"]'
          ),
        };
      })
  );

  await browser.close();
  return articles.filter((a) => a.title && a.url);
};
