const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { spawn } = require("child_process");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const text = args.join(" ").trim();

  if (!text) {
    return sock.sendMessage(from, {
      text: "❌ Masukkan teks untuk dibuat stiker.\nContoh: !atp halo dunia"
    }, { quoted: msg });
  }

  const tempTextPath = path.join(tmpdir(), "text.png");
  const stickerPath = path.join(tmpdir(), "text.webp");

  try {
    // Buat gambar PNG dari teks menggunakan ImageMagick
    await new Promise((resolve, reject) => {
      const convert = spawn("convert", [
        "-background", "transparent",
        "-fill", "white",
        "-font", "Arial",
        "-pointsize", "60",
        `label:${text}`,
        tempTextPath
      ]);

      convert.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error("❌ Gagal membuat gambar dari teks"));
      });
    });

    // Konversi PNG ke stiker WebP
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", tempTextPath,
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
        stickerPath
      ]);

      ffmpeg.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error("❌ Gagal mengubah ke format stiker"));
      });
    });

    const sticker = fs.readFileSync(stickerPath);
    await sock.sendMessage(from, { sticker }, { quoted: msg });

    fs.unlinkSync(tempTextPath);
    fs.unlinkSync(stickerPath);
  } catch (err) {
    console.error("❌ Error atp:", err);
    await sock.sendMessage(from, {
      text: "❌ Terjadi kesalahan saat membuat stiker teks."
    }, { quoted: msg });
  }
};
