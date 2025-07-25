const axios = require("axios");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const url = args[0];

  if (!url || !url.includes("tiktok.com")) {
    return sock.sendMessage(from, { text: "❌ Masukkan URL TikTok yang valid!" }, { quoted: msg });
  }

  try {
    const { data } = await axios.get(`https://api.akuari.my.id/downloader/tiktok?link=${encodeURIComponent(url)}`);
    
    if (!data || !data.respon || !data.respon.video) {
      return sock.sendMessage(from, { text: "❌ Gagal mengambil video TikTok." }, { quoted: msg });
    }

    await sock.sendMessage(from, {
      video: { url: data.respon.video },
      caption: `📥 Video TikTok berhasil diunduh!\n🔗 ${url}`
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error tiktok:", err.message);
    await sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat mengambil video TikTok." }, { quoted: msg });
  }
};
