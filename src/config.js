require('dotenv').config();

module.exports = {
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.instagram.com/v12.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  },
  bot: {
    port: process.env.BOT_PORT || 3000,
    environment: process.env.BOT_ENVIRONMENT || 'development',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/bot.log',
  },
  webhook: {
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN || 'fx_mini_bot_token',
  },
};
