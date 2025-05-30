const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
    console.log(`🔗 QR DATA: ${qr}`);
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ WhatsApp bot is ready!');
});

client.on('message', async (message) => {
    // בדיקת מקור ההודעה
    const chat = await message.getChat();

    // בדיקה אם זו קבוצה ואם זו הקבוצה "בדיקה 1"
    if (chat.isGroup && chat.name === 'בדיקה 1') {
        // חיפוש קבוצה בשם "בדיקה 2"
        const chats = await client.getChats();
        const targetChat = chats.find(c => c.isGroup && c.name === 'בדיקה 2');

        if (targetChat) {
            // שליחת ההודעה לקבוצה השנייה
            await targetChat.sendMessage(message.body);
            console.log(`📤 הודעה הועברה מ"בדיקה 1" ל"בדיקה 2": ${message.body}`);
        } else {
            console.log('❌ לא נמצאה קבוצה בשם "בדיקה 2"');
        }
    }

    // פקודת בדיקה
    if (message.body === '!ping') {
        message.reply('pong');
    }
});

client.initialize();
