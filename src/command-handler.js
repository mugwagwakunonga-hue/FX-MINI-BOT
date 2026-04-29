const logger = require('./logger');

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.registerDefaultCommands();
  }

  /**
   * Register default commands
   */
  registerDefaultCommands() {
    this.registerCommand('help', this.handleHelp.bind(this), 'Show all available commands');
    this.registerCommand('start', this.handleStart.bind(this), 'Initialize the bot');
    this.registerCommand('ping', this.handlePing.bind(this), 'Check bot status');
    this.registerCommand('echo', this.handleEcho.bind(this), 'Echo a message');
    this.registerCommand('info', this.handleInfo.bind(this), 'Bot information');
  }

  /**
   * Register a new command
   * @param {string} name - Command name
   * @param {Function} handler - Command handler function
   * @param {string} description - Command description
   */
  registerCommand(name, handler, description) {
    this.commands.set(name, { handler, description });
    logger.debug(`Command registered: ${name}`);
  }

  /**
   * Get all registered commands
   * @returns {Array}
   */
  getCommands() {
    const cmds = [];
    this.commands.forEach((cmd, name) => {
      cmds.push({
        name,
        description: cmd.description,
      });
    });
    return cmds;
  }

  /**
   * Execute a command
   * @param {string} input - User input
   * @returns {Promise<string>}
   */
  async execute(input) {
    const parts = input.trim().split(' ');
    const commandName = parts[0].toLowerCase().replace('/', '');
    const args = parts.slice(1);

    if (!this.commands.has(commandName)) {
      return `❌ Command "${commandName}" not found. Type /help for available commands.`;
    }

    try {
      const command = this.commands.get(commandName);
      const result = await command.handler(args);
      logger.info(`Command executed: ${commandName}`);
      return result;
    } catch (error) {
      logger.error(`Error executing command: ${commandName}`, { error: error.message });
      return `❌ Error executing command: ${error.message}`;
    }
  }

  /**
   * Handle /help command
   */
  handleHelp() {
    let help = '📚 *Available Commands:*\n\n';
    this.commands.forEach((cmd, name) => {
      help += `*/${name}* - ${cmd.description}\n`;
    });
    return help;
  }

  /**
   * Handle /start command
   */
  handleStart() {
    return '👋 Welcome to FX-MINI-BOT!\n\nI am your personal WhatsApp assistant. Type /help to see what I can do!';
  }

  /**
   * Handle /ping command
   */
  handlePing() {
    return `🏓 Pong! Response time: ${Date.now()}ms`;
  }

  /**
   * Handle /echo command
   */
  handleEcho(args) {
    if (args.length === 0) {
      return '🔊 Please provide text to echo.\nUsage: /echo <text>';
    }
    return `🔊 Echo: ${args.join(' ')}`;
  }

  /**
   * Handle /info command
   */
  handleInfo() {
    return `ℹ️ *FX-MINI-BOT v1.0.0*\n\nA powerful WhatsApp bot inspired by Subzero Mini Bot.\n\n📱 Status: Active\n🔧 Commands: ${this.commands.size}\n⚡ Version: 1.0.0`;
  }
}

module.exports = CommandHandler;
