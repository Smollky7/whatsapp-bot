const fs = require('fs');
const { generateQRCode } = require('./qrCodeGenerator');
const { ia, prompt, prefix } = require('./configLoader');

function clientLoader() {
    const client = generateQRCode(); 

    client.on("message_create", async (msg) => {
        const content = msg.body.toLowerCase().trim();
        if (content.startsWith(prefix)) {
            const command = content.split(' ')[0].substring(1); // Obtém o comando
            const commandFile = `./commands/${command}.js`; // Caminho do arquivo do comando
            if (fs.existsSync(commandFile)) { // Verifica se o arquivo existe
                const cmdFunction = require(commandFile); // Importa a função do comando
                await cmdFunction(msg); // Executa a função do comando
            } else {
                await cmdAsk(msg); // Se o comando não existe, chama o cmdAsk
            }
        }
    });
    
    async function cmdAsk(msg) {
        const content = msg.body.replace(prefix, "").trim();
        try {
            const result = await ia.generateContent(content);
            const response = result.response;
            const text = response.text();
            console.info('\x1b[36m%s\x1b[0m', `User: +${msg.from.toString().split("@")[0]}`);
            console.info('\x1b[37m%s\x1b[0m', `Message: ${content}`);
            console.info('\x1b[36m%s\x1b[0m', `Reply: ${text}`);
            await msg.reply(text);
        } catch (e) {
            await msg.reply('\x1b[31m%s\x1b[0m', `🛑 *ERRO:*: ${e.message}`);
            console.error('\x1b[31m%s\x1b[0m', e.message);
        }
    }
    client.on('ready', () => {
        console.info('\x1b[36m%s\x1b[0m', 'Client is ready! 🎉');
      })
    process.on('unhandledRejection', (e) => {
        console.error('\x1b[31m%s\x1b[0m', e);
    });

    client.initialize();
}

module.exports = clientLoader;