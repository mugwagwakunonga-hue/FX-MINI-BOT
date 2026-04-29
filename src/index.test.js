const FXMiniBot = require('../src/bot');
const CommandHandler = require('../src/command-handler');

describe('FXMiniBot', () => {
  let bot;

  beforeEach(() => {
    bot = new FXMiniBot();
  });

  describe('CommandHandler', () => {
    let commandHandler;

    beforeEach(() => {
      commandHandler = new CommandHandler();
    });

    test('should have help command', () => {
      const commands = commandHandler.getCommands();
      expect(commands.some(c => c.name === 'help')).toBe(true);
    });

    test('should execute help command', async () => {
      const result = await commandHandler.execute('/help');
      expect(result).toContain('Available Commands');
    });

    test('should execute start command', async () => {
      const result = await commandHandler.execute('/start');
      expect(result).toContain('Welcome');
    });

    test('should execute ping command', async () => {
      const result = await commandHandler.execute('/ping');
      expect(result).toContain('Pong');
    });

    test('should handle echo command', async () => {
      const result = await commandHandler.execute('/echo hello world');
      expect(result).toContain('hello world');
    });

    test('should return error for unknown command', async () => {
      const result = await commandHandler.execute('/unknown');
      expect(result).toContain('not found');
    });

    test('should register custom command', () => {
      commandHandler.registerCommand('test', () => 'test response', 'Test command');
      const commands = commandHandler.getCommands();
      expect(commands.some(c => c.name === 'test')).toBe(true);
    });
  });

  describe('Bot registration', () => {
    test('should register custom command', () => {
      bot.registerCommand('custom', () => 'custom response', 'Custom command');
      const commands = bot.commandHandler.getCommands();
      expect(commands.some(c => c.name === 'custom')).toBe(true);
    });
  });
});
