const ytdl = require("ytdl-core");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const url = args[0];

  if (!url || !ytdl.validateURL(url)) {
    return sock.sendMessage(from, { text: "❌ Masukkan URL YouTube yang valid!" }, { quoted: msg });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails.pop().url;
    const duration = info.videoDetails.lengthSeconds;

    // Ambil stream dengan kualitas MP4 terbaik di bawah 25MB
    const format = ytdl.filterFormats(info.formats, "videoandaudio").find(f => f.container === "mp4" && f.contentLength && parseInt(f.contentLength) < 25000000);

    if (!format) {
      return sock.sendMessage(from, { text: "❌ Tidak dapat menemukan video di bawah 25MB. Coba video lain." }, { quoted: msg });
    }

    // Kirim video
    await sock.sendMessage(from, {
      video: { url: format.url },
      caption: `🎬 *Judul:* ${title}\n⏱️ *Durasi:* ${Math.floor(duration / 60)}:${duration % 60}\n📎 *Ukuran:* ${(format.contentLength / 1024 / 1024).toFixed(2)} MB\n🔗 *Link:* ${url}`
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error ytmp4:", err);
    return sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat mengambil video." }, { quoted: msg });
  }
};
