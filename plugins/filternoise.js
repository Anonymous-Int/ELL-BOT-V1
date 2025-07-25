const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { exec } = require("child_process");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const audioMsg = quoted?.audioMessage;

  if (!audioMsg || !audioMsg?.mimetype) {
    return sock.sendMessage(from, {
      text: "❌ Balas voice note/audio *terbaru* dengan perintah: !filternoise"
    }, { quoted: msg });
  }

  const filePath = path.join(tmpdir(), `noise-${Date.now()}`);
  const inputPath = `${filePath}.ogg`;
  const outputPath = `${filePath}-clean.ogg`;

  try {
    const stream = await downloadContentFromMessage(audioMsg, "audio");
    const buffer = [];
    for await (const chunk of stream) buffer.push(chunk);
    fs.writeFileSync(inputPath, Buffer.concat(buffer));

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${inputPath}" -af afftdn "${outputPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const audioBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(from, {
      audio: audioBuffer,
      mimetype: "audio/ogg; codecs=opus",
      ptt: true
    }, { quoted: msg });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error("❌ Error filternoise:", err);
    await sock.sendMessage(from, {
      text: "❌ Gagal menjernihkan audio.\nCoba kirim voice note baru dan balas pakai !filternoise"
    }, { quoted: msg });
  }
};
