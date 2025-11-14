import express from 'express';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.BOT_TOKEN || 'ТОКЕН_ОТ_BOTFATHER';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://ИМЯ-ПРИЛОЖЕНИЯ.onrender.com'; 

const bot = new Telegraf(BOT_TOKEN);

// Кнопка внизу
bot.start((ctx) => {
  return ctx.reply(
    'Нажми кнопку, чтобы открыть проверку IP 👇',
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

// эндпоинт вебхука
app.post(`/tg-webhook`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // устанавливаем webhook
  await bot.telegram.setWebhook(`${WEBHOOK_URL}/tg-webhook`);
  console.log('Webhook установлен:', `${WEBHOOK_URL}/tg-webhook`);
});
