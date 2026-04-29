const express = require('express');
const WhatsAppAPI = require('./whatsapp-api');
const CommandHandler = require('./command-handler');
const logger = require('./logger');
const config = require('./config');

class FXMiniBot {
  constructor() {
    this.app = express();
    this.whatsappAPI = new WhatsAppAPI();
    this.commandHandler = new CommandHandler();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, { ip: req.ip });
      next();
    });
  }

  /**
   * Setup Express routes
   */
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Webhook verification endpoint (for WhatsApp)
    this.app.get('/webhook', (req, res) => {
      const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'fx_mini_bot_token';
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      if (mode === 'subscribe' && token === verifyToken) {
        logger.info('Webhook verified');
        res.status(200).send(challenge);
      } else {
        logger.warn('Webhook verification failed');
        res.sendStatus(403);
      }
    });

    // Webhook POST endpoint (receives messages)
    this.app.post('/webhook', async (req, res) => {
      try {
        const body = req.body;

        if (body.object) {
          if (body.entry &&
              body.entry[0].changes &&
              body.entry[0].changes[0].value.messages &&
              body.entry[0].changes[0].value.messages[0]) {

            const message = body.entry[0].changes[0].value.messages[0];
            const senderPhoneNumber = body.entry[0].changes[0].value.contacts[0].wa_id;

            logger.info(`Message received from ${senderPhoneNumber}`, { 
              messageId: message.id,
              messageType: message.type 
            });

            await this.handleMessage(senderPhoneNumber, message);
          }
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        logger.error('Error processing webhook', { error: error.message });
        res.sendStatus(500);
      }
    });

    // API endpoint to send messages
    this.app.post('/api/send', async (req, res) => {
      try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
          return res.status(400).json({
            error: 'phoneNumber and message are required',
          });
        }

        const result = await this.whatsappAPI.sendMessage(phoneNumber, message);
        res.json(result);
      } catch (error) {
        logger.error('Error sending message', { error: error.message });
        res.status(500).json({ error: 'Failed to send message' });
      }
    });

    // API endpoint to get bot status
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        commands: this.commandHandler.getCommands().length,
      });
    });
  }

  /**
   * Handle incoming message
   * @param {string} senderPhoneNumber - Sender's phone number
   * @param {Object} message - Message object
   */
  async handleMessage(senderPhoneNumber, message) {
    try {
      let responseText = null;

      if (message.type === 'text') {
        const messageText = message.text.body;
        logger.info(`Processing text message: ${messageText}`);

        // Try to execute as command
        responseText = await this.commandHandler.execute(messageText);

        // If not a command, provide default response
        if (!responseText) {
          responseText = `Echo: ${messageText}`;
        }
      } else if (message.type === 'interactive') {
        responseText = 'Interactive message received';
      }

      // Send response
      if (responseText) {
        await this.whatsappAPI.sendMessage(senderPhoneNumber, responseText);
      }

      // Mark message as read
      await this.whatsappAPI.markAsRead(message.id);
    } catch (error) {
      logger.error('Error handling message', { error: error.message });
    }
  }

  /**
   * Start the bot server
   */
  start() {
    const port = config.bot.port;
    this.app.listen(port, () => {
      logger.info(`🤖 FX-MINI-BOT started on port ${port}`);
      logger.info(`Environment: ${config.bot.environment}`);
    });
  }

  /**
   * Register a custom command
   * @param {string} name - Command name
   * @param {Function} handler - Command handler
   * @param {string} description - Command description
   */
  registerCommand(name, handler, description) {
    this.commandHandler.registerCommand(name, handler, description);
  }
}

module.exports = FXMiniBot;
