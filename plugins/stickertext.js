const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { spawn } = require("child_process");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { fileTypeFromBuffer } = require("file-type"); // ✅ Fix import

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const imageMessage = quoted?.imageMessage || msg.message?.imageMessage;

  if (!imageMessage) {
    return sock.sendMessage(from, {
      text: "❌ Balas gambar dengan perintah: !stickertext teks_atas | teks_bawah"
    }, { quoted: msg });
  }

  const teks = args.join(" ").split("|");
  const topText = (teks[0] || "").trim();
  const bottomText = (teks[1] || "").trim();

  try {
    const buffer = await downloadMediaMessage(
      { message: { imageMessage } },
      "buffer",
      {},
      { logger: console }
    );

    const fileTypeResult = await fileTypeFromBuffer(buffer); // ✅ Fix usage
    if (!fileTypeResult) {
      return sock.sendMessage(from, { text: "❌ Tidak dapat mendeteksi tipe file gambar." }, { quoted: msg });
    }

    const inputPath = path.join(tmpdir(), `input.${fileTypeResult.ext}`);
    const outputPath = path.join(tmpdir(), `output.webp`);
    const tempPath = path.join(tmpdir(), `temp.png`);

    fs.writeFileSync(inputPath, buffer);

    // 🖼️ Tambahkan teks dengan ImageMagick
    await new Promise((resolve, reject) => {
      const args = [
  inputPath,
  "-resize", "512x512^", // Ukuran max 512x512 dengan rasio tetap
  "-gravity", "center",
  "-extent", "512x512", // Tambahkan padding kalau perlu
  "-background", "none",
  "-fill", "white",
  "-stroke", "black",
  "-strokewidth", "3",
  "-font", "Arial",
  "-pointsize", "42",
  "-gravity", "north",
  "-annotate", "+0+20", topText,
  "-gravity", "south",
  "-annotate", "+0+20", bottomText,
  tempPath
];


      const convert = spawn("convert", args);
      convert.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error("❌ Gagal memberi teks pada gambar."));
      });
    });

    // 🎞️ Convert PNG ke WebP untuk sticker
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", tempPath,
        "-vcodec", "libwebp",
        "-filter:v", "fps=fps=15",
        "-lossless", "1",
        "-compression_level", "6",
        "-qscale", "75",
        "-preset", "picture",
        "-loop", "0",
        "-an",
        "-vsync", "0",
        "-s", "512x512",
        outputPath
      ]);

      ffmpeg.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error("❌ Gagal convert ke WebP."));
      });
    });

    const sticker = fs.readFileSync(outputPath);
    await sock.sendMessage(from, { sticker }, { quoted: msg });

    // 🧹 Bersihkan file sementara
    fs.unlinkSync(inputPath);
    fs.unlinkSync(tempPath);
    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error("❌ Error stickertext:", err);
    await sock.sendMessage(from, {
      text: "❌ Gagal membuat stiker dengan teks."
    }, { quoted: msg });
  }
};
