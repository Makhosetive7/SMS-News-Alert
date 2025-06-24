import TelegramBot from "node-telegram-bot-api";
import { scrapeBBCNews } from "../services/NewsScrapping/BBCNews.js";
import { scrapeBBCNewsSport } from "../services/NewsScrapping/BBCSport.js";
import { scrapeBBCNewsInnovation } from "../services/NewsScrapping/BBCInnovation.js";
import { scrapeFullArticle } from "../services/NewsScrapping/FullArticle.js";

import users from "../models/users.js";

function startTelegramBot() {
  const token =  process.env.TELEGRAM_BOT_TOKEN;
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Choose a news source:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "1. BBC News", callback_data: "news" }],
          [{ text: "2. BBC Sport", callback_data: "sports" }],
          [{ text: "3. BBC Innovation", callback_data: "innovation" }],
        ],
      },
    });
  });

  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // If it's a category selection
    if (["news", "sports", "innovation"].includes(data)) {
      bot.sendMessage(chatId, "Fetching articles...");

      try {
        let articles;
        switch (data) {
          case "news":
            articles = await scrapeBBCNews();
            break;
          case "sports":
            articles = await scrapeBBCNewsSport();
            break;
          case "innovation":
            articles = await scrapeBBCNewsInnovation();
            break;
        }

        if (!articles || articles.length === 0) {
          return bot.sendMessage(chatId, "No articles found.");
        }

        // Store articles temporarily in memory (can be changed to DB or Redis)
        bot.articlesCache = bot.articlesCache || {};
        bot.articlesCache[`${chatId}_${data}`] = articles;

        const inlineKeyboard = articles.slice(0, 5).map((article, index) => [
          {
            text: article.title,
            callback_data: `article_${index}_${data}`,
          },
        ]);

        bot.sendMessage(chatId, `Top ${data} articles:`, {
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          },
        });
      } catch (err) {
        console.error("Bot error:", err.message);
        bot.sendMessage(chatId, " Failed to fetch articles.");
      }

      return;
    }

    // If it's an article selection
    if (data.startsWith("article_")) {
      const parts = data.split("_");
      const index = parseInt(parts[1]);
      const category = parts[2];

      const articles = bot.articlesCache?.[`${chatId}_${category}`];

      if (!articles || !articles[index]) {
        return bot.sendMessage(chatId, "Article not found.");
      }

      const article = articles[index];

      let articleUrl = article.url;
      if (articleUrl.startsWith("/")) {
        articleUrl = "https://www.bbc.com" + articleUrl;
      }

      const fullArticle = await scrapeFullArticle(articleUrl);

      bot.sendMessage(
        chatId,
        `*Source:* ${article.source || "Unknown"}\n` +
          `*Title:* ${article.title || "Untitled"}\n\n` +
          `${article.description || "No summary available."}\n\n` +
          `${fullArticle.slice(0, 4000)}\n\n[Read more online](${article.url})`,
        {
          parse_mode: "Markdown",
          disable_web_page_preview: false,
        }
      );

      // Save article read to database
      try {
        const user = await users.findOne({ TelegramId: chatId });

        const alreadyRead = user.readArticles.some((a) => a.url === articleUrl);

        if (!alreadyRead) {
          user.readArticles.push({
            title: article.title,
            url: articleUrl,
            category: category,
            source: article.source || "BBCNews",
            readTime: new Date(),
          });
          user.totalArticlesRead += 1;
          await user.save();
        }
      } catch (err) {
        console.error("Database error:", err.message);
      }
    }
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const command = msg.text;

    try {
      // Check if user exists
      let user = await users.findOne({ TelegramId: chatId });

      const commandEntry = {
        command: command,
        description: "Telegram command",
        category: "news", // You can set this dynamically
      };

      if (!user) {
        // Create new user with command array
        user = new users({
          TelegramId: msg.from.id,
          username: msg.from.username || "Unknown",
          commands: [commandEntry],
        });
        await user.save();
      } else {
        // Add new command entry to commands array
        user.commands.push(commandEntry);
        await user.save();
      }
    } catch (err) {
      console.error("Database error:", err.message);
    }
  });
}

export { startTelegramBot };
