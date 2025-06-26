# News Alert Telegram Bot with Analytics & Admin Dashboard

## Overview

**News Alert** a Telegram bot built using **Node.js** and **MongoDB**. It allows users to fetch and read the latest articles scrapped using **Puppeteer** from:

-  **BBC News**
-  **BBC Sport**
-  **BBC Innovation**

The bot supports saving articles, viewing reading history, and provides a powerful **admin analytics dashboard** to monitor article performance and user engagement.

---

##  Features

###  User Features (Telegram Bot)
-  Browse top articles by category
-  Read article summaries and full text
-  Save favorite articles with one click
- `/history` command — View your reading history
-  `/saved` command — Retrieve saved articles
-  Persistent user tracking by Telegram ID

### 📊 Admin Features (Dashboard API)
-  View top read articles
-  View top saved articles
-  Top user commands and engagement
-  Track user activity and popular categories
-  Secure login system using JWT and bcrypt

---
### 🔐 API Endpoints (Admin & Analytics)

| Endpoint                                      | Functionality                                   | HTTP Method | Access         |
|----------------------------------------------|-------------------------------------------------|-------------|----------------|
| `/api/auth/admin/register`                   | Register a new admin user                       | POST        | Public         |
| `/api/auth/admin/login`                      | Admin login and receive JWT token               | POST        | Public         |
| `/api/analytics/top-read`                    | Get top 5 most read articles                    | GET         | Admin Only   |
| `/api/analytics/top-saved`                   | Get top 5 most saved articles                   | GET         | Admin Only   |
| `/api/analytics/top-categories`              | Get top 5 saved categories                      | GET         | Admin Only   |
| `/api/analytics/top-sources`                 | Get top 5 saved sources                         | GET         | Admin Only   |
| `/api/analytics/top-users`                   | Get top 5 most active Telegram users            | GET         | Admin Only   |
| `/api/analytics/top-commands`                | Get most used Telegram commands                 | GET         | Admin Only  |
| `/api/analytics/user-saved/:userId`          | Get saved articles for a specific Telegram user | GET         | Admin Only   |



---

## Tech Stack

- **Node.js** + **Express** — Backend & API
- **Telegram Bot API** (`node-telegram-bot-api`)
- **MongoDB** with Mongoose — Database
- **Cheerio + Axios** — Web scraping articles
- **JWT** — Token-based auth
- **Bcrypt** — Password hashing
- **Dotenv** — Manage environment variables

---

## Installation

```bash
git clone https://github.com/yourusername/news-alert-telegram-bot.git
cd news-alert-telegram-bot
npm install

## Run Project
### Start the development server
```bash
npm run dev



