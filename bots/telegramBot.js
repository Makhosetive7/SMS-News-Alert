import TelegramBot from "node-telegram-bot-api";
import { scrapeBBCNews } from "../services/NewsScrapping/BBCNews.js";
import { scrapeBBCNewsSport } from "../services/NewsScrapping/BBCSport.js";
import { scrapeBBCNewsInnovation } from "../services/NewsScrapping/BBCInnovation.js";

import users from "../models/users.js";

function startTelegramBot() {
  const token = "7959085816:AAFjf_oir8wsH3wYwoxxirQEolNF7yih5Fo";
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
    const selection = callbackQuery.data;

    bot.sendMessage(chatId, "Fetching articles...");

    try {
      let articles;
      switch (selection) {
        case "news":
          articles = await scrapeBBCNews();
          break;
        case "sport":
          articles = await scrapeBBCNewsSport();
          break;
        case "innovation":
          articles = await scrapeBBCNewsInnovation();
          break;
        default:
          return bot.sendMessage(chatId, "Invalid selection.");
      }

      articles.slice(0, 5).forEach((article) => {
        bot.sendMessage(
          chatId,
          `📰 *${article.title}*\n[Read more](${article.link})`,
          {
            parse_mode: "Markdown",
          }
        );
      });
    } catch (err) {
      console.error("Bot error:", err.message);
      bot.sendMessage(chatId, "⚠️ Failed to fetch news.");
    }
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const command = msg.text;

    try {
      // Check if user exists in the database
      let user = await users.findOne({ TelegramId: chatId });

      if (!user) {
        // Create a new user if not found
        user = new users({
          TelegramId: msg.from.id,
          username: msg.from.username || "Unknown",
          command: command,
        });
        await user.save();
      } else {
        user.command = command;
        await user.save();
      }
    } catch (err) {
      console.error("Database error:", err.message);
    }
  });
}

export { startTelegramBot };
