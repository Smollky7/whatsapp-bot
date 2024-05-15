const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('./src/assets/config.json');

// Prompt inicial para a IA
const prompt = `Você é um assistente virtual chamado Javis`;

// Log da chave da API
console.info(`Usando a APIKey GEMINI: ${config.GEMINI_KEY}`);

// Instanciação do cliente de IA
const genAI = new GoogleGenerativeAI(config.GEMINI_KEY);
const ai = genAI.getGenerativeModel({
    model: "gemini-pro"
});

// Instanciação do cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: { 
        type: 'remote', 
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

// Geração do QR Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.info('Waiting for login....\n');
    console.info(`WA Code: ${qr}\n`);
    console.info(`QR Code At: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`);
});

// Log quando o cliente está pronto
client.on('ready', () => {
    console.info('\nClient is ready!\n');
});

// Tratamento de mensagens
client.on("message_create", async (msg) => {
    handler(msg);
});

/**
 * Manipulador de todas as mensagens
 * @param {object} msg - Mensagem recebida
 */
async function handler(msg) {
    if (msg.body.toLowerCase().startsWith("!")) {
        await cmdAsk(msg);
    }
}

/**
 * Manipulador do comando !
 * @param {object} msg - Mensagem recebida
 */
async function cmdAsk(msg) {
    const content = msg.body.replace("!", "").trim();
    try {
        const result = await ai.generateContent(`${prompt}\nUser: ${content}`);
        const response = result.response;
        const text = response.text();
        console.info(`User: +${msg.from.toString().split("@")[0]}\nMessage: ${content}\nReply: ${text}`);
        await msg.reply(text);
    } catch (e) {
        await msg.reply(`🛑 *ERRO:*: ${e.message}`);
        console.error(e.message);
    }
}

// Tratamento de rejeições não tratadas
process.on('unhandledRejection', (e) => {
    console.error(e);
});

module.exports = client;