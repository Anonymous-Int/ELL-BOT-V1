const yts = require("yt-search");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(from, { text: "❌ Masukkan kata kunci pencarian!" }, { quoted: msg });
  }

  try {
    const res = await yts(query);
    const videos = res.videos.slice(0, 5); // Ambil 5 hasil teratas

    if (videos.length === 0) {
      return sock.sendMessage(from, { text: "❌ Tidak ada hasil ditemukan." }, { quoted: msg });
    }

    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      const caption = `
┌──⭓ *Hasil #${i + 1}*
│ 📌 *Judul:* ${v.title}
│ 👤 *Channel:* ${v.author.name}
│ ⏱️ *Durasi:* ${v.timestamp}
│ 📅 *Upload:* ${v.ago}
│ 🔗 *Link:* ${v.url}
└───────────────⭓
      `.trim();

      await sock.sendMessage(from, {
        image: { url: v.thumbnail },
        caption,
      }, { quoted: msg });
    }

  } catch (err) {
    console.error("❌ Error ytsearch:", err);
    await sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat mencari video." }, { quoted: msg });
  }
};
