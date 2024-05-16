const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = 'AIzaSyBHjRPac_TkNZC1helm3AscXr5de3cuOYM';
const genAI = new GoogleGenerativeAI(config);
const ai = genAI.getGenerativeModel({
    model: "gemini-pro"
});

const prompt = `Você é um assistente virtual chamado Javis`;

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

module.exports = cmdAsk;
