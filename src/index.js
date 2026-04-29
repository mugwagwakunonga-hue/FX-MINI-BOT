const FXMiniBot = require('./bot');
const logger = require('./logger');

// Initialize the bot
const bot = new FXMiniBot();

// Register custom commands (optional)
bot.registerCommand('hello', () => {
  return '👋 Hello! How can I help you today?';
}, 'Say hello');

bot.registerCommand('time', () => {
  return `🕐 Current time: ${new Date().toLocaleTimeString()}`;
}, 'Get current time');

bot.registerCommand('date', () => {
  return `📅 Current date: ${new Date().toLocaleDateString()}`;
}, 'Get current date');

// Start the bot
bot.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Bot shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Bot shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason });
});

module.exports = bot;
