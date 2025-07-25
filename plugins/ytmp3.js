const youtubedl = require("youtube-dl-exec");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");

module.exports = async (sock, msg, args, { config }) => {
  const from = msg.key.remoteJid;
  const teks = args.join(" ");
  if (!teks) {
    return sock.sendMessage(from, { text: "❌ Kirim perintah seperti: *!ytmp3 link*" }, { quoted: msg });
  }

  try {
    const tempPath = path.join(tmpdir(), `yt-${Date.now()}.mp3`);

    await youtubedl(teks, {
      output: tempPath,
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0, // best
      ffmpegLocation: require("ffmpeg-static"), // pakai ffmpeg bawaan
    });

    const metadata = await youtubedl(teks, {
      dumpSingleJson: true,
      noWarnings: true,
    });

    const mp3Buffer = fs.readFileSync(tempPath);

    await sock.sendMessage(from, {
      document: mp3Buffer,
      mimetype: "audio/mpeg",
      fileName: `${metadata.title}.mp3`,
      caption: `🎵 *Judul:* ${metadata.title}\n🕒 *Durasi:* ${metadata.duration}\n📥 *Ukuran:* ${metadata.filesize_approx || 'unknown'}\n\n✅ MP3 berhasil diunduh!`,
    }, { quoted: msg });

    fs.unlinkSync(tempPath); // bersihkan file sementara
  } catch (err) {
    console.error("❌ Error ytmp3:", err);
    await sock.sendMessage(from, { text: "❌ Gagal mengunduh MP3. Pastikan link valid." }, { quoted: msg });
  }
};
