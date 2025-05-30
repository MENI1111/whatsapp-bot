const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', (qr) => {
    console.log(`🔗 QR DATA: ${qr}`);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

client.on('message', async (message) => {
    try {
        const chat = await message.getChat();

        // הדפסת כל הודעה כדי לבדוק שהיא בכלל מזוהה
        console.log(`📩 התקבלה הודעה מ-${chat.name}: ${message.body}`);

        // רק אם ההודעה היא מקבוצת "בדיקה 1"
        if (chat.isGroup && chat.name === 'בדיקה 1') {
            const allChats = await client.getChats();
            const targetChat = allChats.find(c => c.isGroup && c.name === 'בדיקה 2');

            if (targetChat) {
                await targetChat.sendMessage(`📤 מועבר מ-"${chat.name}":\n${message.body}`);
                console.log(`➡️ ההודעה הועברה ל-${targetChat.name}`);
            } else {
                console.log('⚠️ קבוצה "בדיקה 2" לא נמצאה!');
            }
        }

    } catch (err) {
        console.error('❌ שגיאה בטיפול בהודעה:', err);
    }
});

client.initialize();
