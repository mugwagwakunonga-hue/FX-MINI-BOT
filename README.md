# FX-MINI-BOT - WhatsApp Bot

A powerful WhatsApp bot inspired by Subzero Mini Bot, with command handling, message processing, and various utilities.

## Features

- 🤖 Automated WhatsApp messaging
- 💬 Command-based interaction system
- 🎯 Message processing and routing
- 🔌 WhatsApp Business API integration
- ⚙️ Configurable commands and responses
- 📊 Logging and error handling
- 🚀 Easy to extend and customize

## Prerequisites

- Node.js 14.0 or higher
- npm or yarn
- WhatsApp Business Account
- Phone number for WhatsApp Business API

## Installation

```bash
# Clone the repository
git clone https://github.com/mugwagwakunonga-hue/FX-MINI-BOT.git
cd FX-MINI-BOT

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
WHATSAPP_API_URL=https://graph.instagram.com/v12.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_access_token
BOT_PORT=3000
LOG_LEVEL=info
```

## Usage

```bash
# Start the bot
npm start

# Development mode with auto-reload
npm run dev

# Run tests
npm test
```

## Project Structure

```
FX-MINI-BOT/
├── src/
│   ├── index.js              # Entry point
│   ├── config.js             # Configuration
│   ├── bot.js                # Main bot class
│   ├── command-handler.js    # Command system
│   ├── whatsapp-api.js       # WhatsApp API client
│   └── logger.js             # Logging setup
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

## Available Commands

- `/help` - Show all available commands
- `/start` - Initialize the bot
- `/ping` - Check bot status
- `/echo [message]` - Repeat a message
- `/info` - Bot information
- `/hello` - Say hello
- `/time` - Get current time
- `/date` - Get current date

## API Endpoints

- `GET /health` - Health check
- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive messages
- `POST /api/send` - Send message
- `GET /api/status` - Get bot status

## Extending the Bot

To add a custom command:

```javascript
bot.registerCommand('mycommand', (args) => {
  return 'My command response';
}, 'My command description');
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Support

For issues and questions, please open a GitHub issue in this repository.
