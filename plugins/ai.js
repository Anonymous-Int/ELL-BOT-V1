// plugins/ai.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const prompt = args.join(" ");

  if (!prompt) {
    return sock.sendMessage(from, { text: "❌ Masukkan pertanyaan!\nContoh: !ai siapa presiden Indonesia?" }, { quoted: msg });
  }

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = res.choices[0].message.content;
    await sock.sendMessage(from, { text: reply }, { quoted: msg });
  } catch (err) {
    console.error("❌ Error OpenAI:", err);
    await sock.sendMessage(from, { text: "❌ Gagal mendapatkan jawaban dari AI." }, { quoted: msg });
  }
};
