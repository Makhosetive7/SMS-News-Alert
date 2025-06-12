const TelegramBot = require("node-telegram-bot-api");
const {
  scrapeBBCNews,
  scrapeCNNHealth,
  scrapeTechCrunch,
} = require("../services/newsScrapping");

function startTelegramBot() {
  const token = "7959085816:AAFjf_oir8wsH3wYwoxxirQEolNF7yih5Fo"; 
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Choose a news source:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "1. BBC News", callback_data: "bbc" }],
          [{ text: "2. CNN Health", callback_data: "cnn" }],
          [{ text: "3. TechCrunch", callback_data: "techcrunch" }],
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
        case "bbc":
          articles = await scrapeBBCNews();
          break;
        case "cnn":
          articles = await scrapeCNNHealth();
          break;
        case "techcrunch":
          articles = await scrapeTechCrunch();
          break;
        default:
          return bot.sendMessage(chatId, "Invalid selection.");
      }

      articles.slice(0, 5).forEach((article) => {
        bot.sendMessage(chatId, `📰 *${article.title}*\n[Read more](${article.link})`, {
          parse_mode: "Markdown",
        });
      });
    } catch (err) {
      console.error("Bot error:", err.message);
      bot.sendMessage(chatId, "⚠️ Failed to fetch news.");
    }
  });
}


module.exports = startTelegramBot;
