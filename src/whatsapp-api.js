const axios = require('axios');
const config = require('./config');
const logger = require('./logger');

class WhatsAppAPI {
  constructor() {
    this.baseUrl = config.whatsapp.apiUrl;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    this.accessToken = config.whatsapp.accessToken;
  }

  /**
   * Send a text message via WhatsApp
   * @param {string} phoneNumber - Recipient's phone number
   * @param {string} message - Message text
   * @returns {Promise}
   */
  async sendMessage(phoneNumber, message) {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      logger.info(`Message sent to ${phoneNumber}`, { messageId: response.data.messages[0].id });
      return response.data;
    } catch (error) {
      logger.error('Failed to send message', { error: error.message, phoneNumber });
      throw error;
    }
  }

  /**
   * Send a template message
   * @param {string} phoneNumber - Recipient's phone number
   * @param {string} templateName - Template name
   * @param {Array} parameters - Template parameters
   * @returns {Promise}
   */
  async sendTemplateMessage(phoneNumber, templateName, parameters = []) {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en_US' },
            parameters: { body: { parameters } },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      logger.info(`Template message sent to ${phoneNumber}`, { templateName });
      return response.data;
    } catch (error) {
      logger.error('Failed to send template message', { error: error.message, phoneNumber });
      throw error;
    }
  }

  /**
   * Mark a message as read
   * @param {string} messageId - Message ID
   * @returns {Promise}
   */
  async markAsRead(messageId) {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      logger.debug(`Message marked as read`, { messageId });
    } catch (error) {
      logger.error('Failed to mark message as read', { error: error.message, messageId });
    }
  }
}

module.exports = WhatsAppAPI;
