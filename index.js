const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
    // מציג את ה־QR כטקסט בקונסול
    console.log(`🔗 QR DATA: ${qr}`);

    // אפשר גם להמשיך להציג את הקוד כגרפיקה בקונסול
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

client.on('message', async (message) => {
    if (message.body === '!ping') {
        message.reply('pong');
    }
});

client.initialize();
