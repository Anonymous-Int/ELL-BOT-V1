const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { exec } = require("child_process");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const audioMessage = quoted?.audioMessage;

  if (!quoted || !audioMessage?.mimetype) {
    return sock.sendMessage(from, {
      text: "❌ Balas voice note dengan perintah: !totext"
    }, { quoted: msg });
  }

  const inputPath = path.join(tmpdir(), `audio-${Date.now()}.ogg`);
  const wavPath = inputPath.replace(".ogg", ".wav");

  try {
    const stream = await downloadContentFromMessage(audioMessage, "audio");
    const buffer = [];
    for await (const chunk of stream) buffer.push(chunk);
    fs.writeFileSync(inputPath, Buffer.concat(buffer));

    // Konversi OGG ke WAV (untuk whisper)
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 "${wavPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Transkrip pakai whisper (via Python)
    const whisperCommand = `whisper "${wavPath}" --language Indonesian --model tiny --output_format txt --output_dir ${tmpdir()}`;
    await new Promise((resolve, reject) => {
      exec(whisperCommand, (err, stdout, stderr) => {
        if (err) reject(stderr);
        else resolve(stdout);
      });
    });

    const txtFile = wavPath.replace(".wav", ".txt");
    const text = fs.readFileSync(txtFile, "utf-8").trim();

    if (text) {
      await sock.sendMessage(from, { text: `🗣️ *Hasil transkripsi:*\n${text}` }, { quoted: msg });
    } else {
      throw new Error("Teks kosong.");
    }

    // Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(wavPath);
    fs.unlinkSync(txtFile);
  } catch (err) {
    console.error("❌ Error totext:", err);
    await sock.sendMessage(from, {
      text: "❌ Gagal mengenali suara jadi teks."
    }, { quoted: msg });
  }
};
