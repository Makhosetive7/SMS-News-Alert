import TelegramBot from "node-telegram-bot-api";
import { scrapeBBCNews } from "../services/NewsScrapping/BBCNews.js";
import { scrapeBBCNewsSport } from "../services/NewsScrapping/BBCSport.js";
import { scrapeBBCNewsInnovation } from "../services/NewsScrapping/BBCInnovation.js";
import { scrapeFullArticle } from "../services/NewsScrapping/FullArticle.js";

import telegramUser from "../models/telegramUsersSchema.js";
import articlesRead from "../models/articlesReadSchema.js";
import savedArticles from "../models/savedArticleSchema.js";

import { updateArticleStats } from "../services/Analytics/articleAnalysisLogger.js";
import {
  logUserCommand,
  logUserArticleEvent,
} from "../services/Analytics/userAnalysisLogger.js";

function startTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const bot = new TelegramBot(token, { polling: true });

  // In-memory map to keep article info by short id to avoid long callback_data
  bot.articleSaveMap = {};

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

    // Category selection
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

        bot.articlesCache = bot.articlesCache || {};
        bot.articlesCache[`${chatId}_${data}`] = articles;

        const inlineKeyboard = articles.slice(0, 10).map((article, index) => [
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
        bot.sendMessage(chatId, "Failed to fetch articles.");
      }

      return;
    }

    // Article selection
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

      // Generate short unique id for this article save button
      const articleId = `${chatId}_${Date.now()}_${index}`;
      bot.articleSaveMap[articleId] = {
        url: articleUrl,
        title: article.title,
        category,
        source: article.source || "BBCNews",
      };

      await bot.sendMessage(
        chatId,
        `*Source:* ${article.source || "Unknown"}\n` +
          `*Title:* ${article.title || "Untitled"}\n\n` +
          `${article.description || "No summary available."}\n\n${fullArticle.slice(
            0,
            4000
          )}\n\n[Read more online](${articleUrl})`,
        {
          parse_mode: "Markdown",
          disable_web_page_preview: false,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "💾Save Article",
                  callback_data: `save_${articleId}`,
                },
              ],
            ],
          },
        }
      );

      // Save article read info to DB
      try {
        const user = await telegramUser.findOne({ TelegramId: chatId });
        if (!user) {
          console.error("User not found in database.");
          return;
        }

        const alreadyRead = await articlesRead.findOne({
          user: user._id,
          url: articleUrl,
        });

        if (!alreadyRead) {
          await articlesRead.create({
            user: user._id,
            title: article.title || "Untitled",
            url: articleUrl || "unknown",
            category: category || "unknown",
            source: article.source || "unknown",
            readTime: new Date(),
          });

          user.totalArticlesRead = (user.totalArticlesRead || 0) + 1;
          await user.save();

          // Update analytics for read
          await updateArticleStats(article, "read");
          await logUserArticleEvent(user._id, "read", article);
        }
      } catch (err) {
        console.error("Database error:", err.message);
      }
    }

    // Save article callback handler
    if (data.startsWith("save_")) {
      const articleId = data.split("save_")[1];
      const article = bot.articleSaveMap[articleId];

      if (!article) {
        return bot.sendMessage(chatId, "❌ Article data not found.");
      }

      try {
        const user = await telegramUser.findOne({ TelegramId: chatId });
        if (!user) {
          return bot.sendMessage(chatId, "User not found in the system.");
        }

        const articleExist = await savedArticles.findOne({
          user: user._id,
          url: article.url,
        });

        if (articleExist) {
          return bot.sendMessage(chatId, "✅ Article already saved.");
        }

        await savedArticles.create({
          user: user._id,
          url: article.url,
          title: article.title,
          category: article.category,
          source: article.source,
          savedAt: new Date(),
        });

        // Update analytics for save
        await updateArticleStats(article, "save");
        await logUserArticleEvent(user._id, "saved", article);

        bot.sendMessage(chatId, "✅ Article saved successfully.");
      } catch (err) {
        console.error("Save button error:", err.message);
        bot.sendMessage(chatId, "❌ Failed to save the article.");
      }
    }
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const command = msg.text;

    try {
      let user = await telegramUser.findOne({ TelegramId: chatId });

      const commandEntry = {
        command: command,
        description: "Telegram command",
        category: "news",
      };

      if (!user) {
        user = new telegramUser({
          TelegramId: msg.from.id,
          username: msg.from.username || "Unknown",
          commands: [commandEntry],
          totalArticlesRead: 0,
        });
        await user.save();
      } else {
        user.commands.push(commandEntry);
        await user.save();
      }

      // Log the command for analytics
      await logUserCommand(user._id, command);
    } catch (err) {
      console.error("Database error:", err.message);
    }
  });

  // Retrieve user reading history
  bot.onText(/\/history/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await telegramUser.findOne({ TelegramId: chatId });

      if (!user) {
        return bot.sendMessage(chatId, "User not found in the database.");
      }

      const articleHistory = await articlesRead
        .find({ user: user._id })
        .sort({ readTime: -1 })
        .limit(3);

      if (articleHistory.length === 0) {
        return bot.sendMessage(chatId, "No articles read yet.");
      }

      const historyText = articleHistory
        .map(
          (item, index) =>
            `*${index + 1}. ${item.title || "Untitled"}*\n[Read again](${
              item.url
            })\n`
        )
        .join("\n");

      bot.sendMessage(chatId, `*Your Reading History:*\n\n${historyText}`, {
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      });
    } catch (err) {
      console.error("Database error:", err.message);
      return bot.sendMessage(chatId, "Failed to retrieve history.");
    }
  });

  // Retrieve saved articles
  bot.onText(/\/saved/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await telegramUser.findOne({ TelegramId: chatId });

      if (!user) {
        return bot.sendMessage(chatId, "User not found in the database.");
      }

      const savedArticlesList = await savedArticles
        .find({ user: user._id })
        .sort({ savedAt: -1 })
        .limit(5);

      if (savedArticlesList.length === 0) {
        return bot.sendMessage(chatId, "No saved articles found.");
      }

      const savedText = savedArticlesList
        .map(
          (article, index) =>
            `*${index + 1}. ${article.title}*\n_Category:_ ${
              article.category
            }\n[Open Article](${article.url})\n`
        )
        .join("\n");

      bot.sendMessage(chatId, `*Your Saved Articles:*\n\n${savedText}`, {
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      });
    } catch (err) {
      console.error("Database error:", err.message);
      return bot.sendMessage(chatId, "Failed to retrieve saved articles.");
    }
  });
}

export { startTelegramBot };
