const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");

const helpMessage = `❌ Format salah. Berikut cara penggunaan:

📌 *Cara pakai:*
!tts <kode_bahasa> <teks>

📌 *Contoh:*
!tts id Selamat pagi semuanya
!tts en Hello, how are you?
!tts ja おはようございます

📚 *Kode Bahasa Umum:*
- 🇮🇩 Indonesia: id
- 🇺🇸 English: en
- 🇸🇦 Arab: ar
- 🇯🇵 Jepang: ja
- 🇨🇳 Mandarin: zh-CN
- 🇫🇷 Prancis: fr
- 🇰🇷 Korea: ko
- 🇩🇪 Jerman: de
- 🇪🇸 Spanyol: es
- 🇮🇹 Italia: it

🗒️ Gunakan kode ISO 639-1 untuk bahasa lainnya.
`;

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
  const args = body.trim().split(" ");
  const lang = args[1];
  const teks = args.slice(2).join(" ");

  if (!lang || !teks) {
    return sock.sendMessage(from, { text: helpMessage }, { quoted: msg });
  }

  const fileName = `tts-${Date.now()}`;
  const mp3Path = path.join(tmpdir(), `${fileName}.mp3`);
  const oggPath = path.join(tmpdir(), `${fileName}.ogg`);
  const escaped = teks.replace(/"/g, '\\"');

  exec(`gtts-cli --lang ${lang} "${escaped}" --output "${mp3Path}"`, (err) => {
    if (err) {
      console.error("❌ Error tts:", err);
      return sock.sendMessage(from, {
        text: "❌ Gagal mengubah teks ke suara. Pastikan kode bahasa benar."
      }, { quoted: msg });
    }

    exec(`ffmpeg -i "${mp3Path}" -c:a libopus -b:a 128k -ar 48000 "${oggPath}"`, async (err) => {
      if (err) {
        console.error("❌ Error convert:", err);
        return sock.sendMessage(from, {
          text: "❌ Gagal mengonversi ke voice note."
        }, { quoted: msg });
      }

      const audioBuffer = fs.readFileSync(oggPath);

      await sock.sendMessage(from, {
        audio: audioBuffer,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      }, { quoted: msg });

      fs.unlinkSync(mp3Path);
      fs.unlinkSync(oggPath);
    });
  });
};
