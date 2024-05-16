const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

function generateQRCode() {
    const client = new Client({
        authStrategy: new LocalAuth(),
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
    });

    client.on('qr', (qr) => {
      console.log('\x1b[33m%s\x1b[0m', 'Generating QR Code... 📱\n');
        console.info('\x1b[33m%s\x1b[0m', '=======================');
        qrcode.generate(qr, { small: true });
        console.info('\x1b[32m%s\x1b[0m', 'Waiting for login....');
        console.info('\x1b[35m%s\x1b[0m', `Scan the QR Code below: \n`);
        console.info('\x1b[37m%s\x1b[0m', `QR Code At: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`);
        console.info('\x1b[33m%s\x1b[0m', '=======================');
    });

    return client;
}

module.exports = { generateQRCode };