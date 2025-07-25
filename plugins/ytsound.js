const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
  const url = body.trim().split(" ")[1];

  if (!url || !url.startsWith("http")) {
    return sock.sendMessage(from, {
      text: "❌ Kirim perintah dengan link YouTube.\nContoh:\n!ytsound https://youtu.be/abc123"
    }, { quoted: msg });
  }

  const id = Date.now();
  const outputPath = path.join(tmpdir(), `ytsound-${id}.mp3`);

  const cmd = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;

  sock.sendMessage(from, { text: "⏳ Mengunduh audio dari YouTube..." }, { quoted: msg });

  exec(cmd, async (err) => {
    if (err || !fs.existsSync(outputPath)) {
      console.error("❌ Error ytsound:", err);
      return sock.sendMessage(from, {
        text: "❌ Gagal mengunduh audio dari YouTube."
      }, { quoted: msg });
    }

    const audioBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(from, {
      document: audioBuffer,
      mimetype: "audio/mpeg",
      fileName: `ytsound-${id}.mp3`
    }, { quoted: msg });

    fs.unlinkSync(outputPath);
  });
};
