const axios = require("axios");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const url = args[0];

  if (!url || !url.includes("twitter.com")) {
    return sock.sendMessage(from, { text: "❌ Masukkan URL Twitter yang valid!\nContoh : !twitter <Url>" }, { quoted: msg });
  }

  try {
    const { data } = await axios.get(`https://api.akuari.my.id/downloader/twitter?link=${encodeURIComponent(url)}`);
    
    if (!data || !data.respon || !data.respon[0]) {
      return sock.sendMessage(from, { text: "❌ Gagal mengambil video dari Twitter." }, { quoted: msg });
    }

    // ambil kualitas terbaik
    const media = data.respon.find(v => v.includes(".mp4"));

    await sock.sendMessage(from, {
      video: { url: media },
      caption: `📥 Video dari Twitter berhasil diunduh!\n🔗 ${url}`
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error twitter:", err.message);
    await sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat mengambil video Twitter." }, { quoted: msg });
  }
};
