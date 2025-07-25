const axios = require("axios");
require("dotenv").config();

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const url = args[0];

  if (!url || !/^https?:\/\//i.test(url)) {
    return sock.sendMessage(from, {
      text: "❌ Masukkan URL valid untuk dipendekkan, contoh:\n!short https://example.com"
    }, { quoted: msg });
  }

  try {
    const apiKey = process.env.BITLY_API_KEY;
    const response = await axios.post(
      "https://api-ssl.bitly.com/v4/shorten",
      {
        long_url: url
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const shortUrl = response.data.link;

    await sock.sendMessage(from, {
      text: `🔗 URL berhasil dipendekkan dengan Bitly:\n${shortUrl}`
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error dari Bitly:", err.response?.data || err.message);
    await sock.sendMessage(from, {
      text: "❌ Gagal memendekkan URL. Pastikan API Key benar & URL valid."
    }, { quoted: msg });
  }
};
