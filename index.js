const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chromium = require('chrome-aws-lambda');

const SOURCE_GROUP = 'בדיקה 1';
const TARGET_GROUP = 'בדיקה 2';

(async () => {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: await chromium.executablePath || null,
      headless: true,
      args: chromium.args
    }
  });

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📱 סרוק את הקוד כדי להתחבר לוואטסאפ');
  });

  client.on('ready', () => {
    console.log('🤖 הבוט פעיל ומוכן!');
  });

  client.on('message_create', async (msg) => {
    if (msg.fromMe) return;

    const chat = await msg.getChat();
    if (!chat.isGroup || chat.name !== SOURCE_GROUP) return;

    const allChats = await client.getChats();
    const targetChat = allChats.find(c => c.name === TARGET_GROUP);
    if (!targetChat) return;

    if (msg.hasMedia) {
      const media = await msg.downloadMedia();
      await targetChat.sendMessage(media, { caption: msg.body || '' });
    } else {
      await targetChat.sendMessage(msg.body);
    }
  });

  client.initialize();
})();
