const fs = require("fs");
const path = require("path");
const googleTTS = require("google-tts-api");
const { tmpdir } = require("os");
const { exec } = require("child_process");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const teks = args.join(" ").trim();

  if (!teks) {
    return sock.sendMessage(from, {
      text: "❌ Masukkan teks untuk dijadikan VN, contoh: !vn Halo semuanya"
    }, { quoted: msg });
  }

  try {
    const url = googleTTS.getAudioUrl(teks, {
      lang: 'id',
      slow: false,
      host: 'https://translate.google.com',
    });

    const mp3Path = path.join(tmpdir(), `vn-${Date.now()}.mp3`);
    const opusPath = path.join(tmpdir(), `vn-${Date.now()}.opus`);

    // Download mp3 dari URL
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(mp3Path, Buffer.from(buffer));

    // Convert ke .opus (voice note)
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${mp3Path}" -c:a libopus -b:a 64k "${opusPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const audioBuffer = fs.readFileSync(opusPath);

    await sock.sendMessage(from, {
      audio: audioBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: msg });

    fs.unlinkSync(mp3Path);
    fs.unlinkSync(opusPath);
  } catch (err) {
    console.error("❌ Error !vn:", err);
    await sock.sendMessage(from, {
      text: "❌ Gagal mengubah teks menjadi VN."
    }, { quoted: msg });
  }
};
