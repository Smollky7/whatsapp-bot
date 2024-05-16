const { GEMINI_KEY, PROMPT, PREFIX  } = require('../config/config.json');
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log('\x1b[36m%s\x1b[0m', 'Loading configurations... 🚀');
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const ia = genAI.getGenerativeModel({
    model: "gemini-pro"
});

module.exports = {
    ia: ia,
    prompt: PROMPT,
    prefix: PREFIX
};