const axios = require("axios");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const url = args[0];

  if (!url || !url.includes("instagram.com")) {
    return sock.sendMessage(from, { text: "❌ Masukkan URL Instagram yang valid!" }, { quoted: msg });
  }

  try {
    const { data } = await axios.get(`https://api.akuari.my.id/downloader/instagram?link=${encodeURIComponent(url)}`);

    if (!data || !data.respon || data.respon.length === 0) {
      return sock.sendMessage(from, { text: "❌ Gagal mengambil data dari Instagram." }, { quoted: msg });
    }

    for (let media of data.respon) {
      const isVideo = media.includes(".mp4");

      await sock.sendMessage(from, {
        [isVideo ? "video" : "image"]: { url: media },
        caption: `📥 Berhasil mengunduh dari Instagram.\n🔗 ${url}`
      }, { quoted: msg });
    }

  } catch (err) {
    console.error("❌ Error instagram:", err.message);
    await sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat mengambil media Instagram." }, { quoted: msg });
  }
};
