const axios = require("axios");

module.exports = async (sock, msg) => {
  try {
    const res = await axios.get("https://api.quotable.io/random");
    const { content, author } = res.data;
    await sock.sendMessage(msg.key.remoteJid, { text: `"${content}"
- ${author}` }, { quoted: msg });
  } catch (e) {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Gagal mengambil quote." }, { quoted: msg });
  }
};