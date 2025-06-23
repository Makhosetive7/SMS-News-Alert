import puppeteer from 'puppeteer';

export const scrapeBBCNews = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
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
    
    return articles.filter(a => a.title && a.url);
  } catch (error) {
    console.error('BBC News scraping error:', error);
    return [];
  } finally {
    await browser.close();
  }
};

export const scrapeBBCNewsInnovation = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.bbc.com/innovation", { waitUntil: "networkidle2" });

    const articles = await page.$$eval(
      '[data-testid^="london-card"], [data-testid^="dundee-card"], [data-testid^="manchester-card"], [data-testid^="liverpool-card"]',
      (cards) => cards.map((card) => {
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
          hasVideo: !!card.querySelector('[data-testid="content-type-icon-wrapper"]')
        };
      })
    );

    return articles.filter((a) => a.title && a.url);
  } catch (error) {
    console.error('BBC Innovation scraping error:', error);
    return [];
  } finally {
    await browser.close();
  }
};

export const scrapeBBCNewsSport = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.bbc.com/sport", { waitUntil: "networkidle2" });

    const articles = await page.$$eval(
      '[data-testid^="london-card"], [data-testid^="dundee-card"], [data-testid^="manchester-card"], [data-testid^="liverpool-card"]',
      (cards) => cards.map((card) => {
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
          hasVideo: !!card.querySelector('[data-testid="content-type-icon-wrapper"]')
        };
      })
    );

    return articles.filter((a) => a.title && a.url);
  } catch (error) {
    console.error('BBC Sport scraping error:', error);
    return [];
  } finally {
    await browser.close();
  }
};