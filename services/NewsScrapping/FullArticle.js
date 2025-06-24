import puppeteer from "puppeteer";  


// Full Article Scraper
export const scrapeFullArticle = async (url)=> {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const article = await page.evaluate(() => {
        const getText = (selector) => document.querySelector(selector)?.textContent.trim() || null;
        const getAttr = (selector, attr) => document.querySelector(selector)?.getAttribute(attr) || null;

        return {
            headline: getText("[data-component='subheadline-block']"),
            story: getText("[data-component='text-block']"),
        };
    });

    await browser.close();
    return `${article.headline}\n\n${article.story}`;

}