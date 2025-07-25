const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
  const teks = body.trim().split(" ").slice(1).join(" ");

  if (!teks) {
    return sock.sendMessage(from, {
      text: "❌ Masukkan teks yang ingin diucapkan, contoh:\n!say Halo semuanya"
    }, { quoted: msg });
  }

  const fileName = `say-${Date.now()}`;
  const mp3Path = path.join(tmpdir(), `${fileName}.mp3`);
  const oggPath = path.join(tmpdir(), `${fileName}.ogg`);
  const escaped = teks.replace(/"/g, '\\"');

  // Step 1: Buat MP3 dari teks
  exec(`gtts-cli "${escaped}" --output "${mp3Path}"`, (err) => {
    if (err) {
      console.error("❌ Error say:", err);
      return sock.sendMessage(from, {
        text: "❌ Gagal mengubah teks ke suara."
      }, { quoted: msg });
    }

    // Step 2: Konversi MP3 ke OGG/OPUS agar bisa jadi voice note
    exec(`ffmpeg -i "${mp3Path}" -c:a libopus -b:a 128k -ar 48000 "${oggPath}"`, async (err) => {
      if (err) {
        console.error("❌ Error convert to ogg:", err);
        return sock.sendMessage(from, {
          text: "❌ Gagal mengonversi suara ke voice note."
        }, { quoted: msg });
      }

      const audioBuffer = fs.readFileSync(oggPath);

      await sock.sendMessage(from, {
        audio: audioBuffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      }, { quoted: msg });

      // Hapus file sementara
      fs.unlinkSync(mp3Path);
      fs.unlinkSync(oggPath);
    });
  });
};
