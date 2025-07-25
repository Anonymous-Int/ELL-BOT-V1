// plugins/toaudio.js
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { exec } = require("child_process");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;

  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const mime = quoted?.audioMessage?.mimetype || quoted?.videoMessage?.mimetype;

  if (!quoted || !mime) {
    return sock.sendMessage(from, {
      text: "❌ Balas pesan audio atau video dengan perintah: !toaudio"
    }, { quoted: msg });
  }

  const mediaType = mime.startsWith("video") ? "video" : "audio";
  const filePath = path.join(tmpdir(), `toaudio-${Date.now()}`);
  const inputPath = `${filePath}.${mediaType === "video" ? "mp4" : "ogg"}`;
  const outputPath = `${filePath}.mp3`;

  try {
    // Download media dari quotedMessage
    const stream = await downloadContentFromMessage(quoted[`${mediaType}Message`], mediaType);
    const buffer = [];

    for await (const chunk of stream) buffer.push(chunk);
    fs.writeFileSync(inputPath, Buffer.concat(buffer));

    // Konversi ke MP3 pakai ffmpeg
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${inputPath}" -vn -ab 128k -ar 44100 -y "${outputPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const audioBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(from, {
      document: audioBuffer,
      fileName: "audio.mp3",
      mimetype: "audio/mpeg"
    }, { quoted: msg });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error("❌ Error toaudio:", err);
    await sock.sendMessage(from, {
      text: "❌ Gagal mengonversi ke audio."
    }, { quoted: msg });
  }
};
