const express = require('express');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://check-ip-bot-tg.onrender.com';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не задан');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// /start — показываем кнопку внизу
bot.start((ctx) => {
  return ctx.reply(
    'Нажми кнопку внизу, чтобы открыть проверку IP 👇',
    {
      reply_markup: {
        keyboard: [[
          {
            text: '🔍 Проверить IP',
            web_app: { url: 'https://scamalytics.com/' }
          }
        ]],
        resize_keyboard: true
      }
    }
  );
});

const app = express();
app.use(express.json());

// используем штатный webhookCallback
app.post('/tg-webhook', bot.webhookCallback('/tg-webhook'));

// простой корневой GET, чтобы Render показывал что-то в браузере
app.get('/', (req, res) => {
  res.send('Telegram bot is running ✅');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log('Server running on port', PORT);

  const webhookUrl = `${WEBHOOK_URL}/tg-webhook`;
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log('✅ Webhook установлен:', webhookUrl);
  } catch (err) {
    console.error('❌ Ошибка установки webhook:', err.message);
  }
});
