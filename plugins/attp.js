const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { spawn } = require("child_process");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const teks = args.join(" ").trim();

  if (!teks) {
    return sock.sendMessage(from, { text: "❌ Kirim perintah seperti: *!attp teks*" }, { quoted: msg });
  }

  const tmp = tmpdir();
  const fontPath = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; // ganti font jika punya lebih bagus
  const baseName = `attp-${Date.now()}`;
  const frameCount = 8;
  const framePaths = [];
  const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "white"];

  try {
    // Buat frame teks dengan warna-warna berbeda
    for (let i = 0; i < frameCount; i++) {
      const framePath = path.join(tmp, `${baseName}-frame-${i}.png`);
      const color = colors[i % colors.length];

      const args = [
        "-size", "512x512",
        "xc:transparent",
        "-gravity", "center",
        "-font", fontPath,
        "-pointsize", "48",
        "-fill", color,
        "-stroke", "black",
        "-strokewidth", "2",
        "-annotate", "+0+0", teks,
        framePath
      ];

      await new Promise((resolve, reject) => {
        const convert = spawn("convert", args);
        convert.on("exit", code => code === 0 ? resolve() : reject(`convert frame ${i} gagal`));
      });

      framePaths.push(framePath);
    }

    const webpPath = path.join(tmp, `${baseName}.webp`);

    // Gabungkan semua frame jadi animasi WebP
    await new Promise((resolve, reject) => {
      const args = [
        "-loop", "0",
        "-delay", "10",
        ...framePaths,
        webpPath
      ];
      const convert = spawn("convert", args);
      convert.on("exit", code => code === 0 ? resolve() : reject("❌ Gagal menggabungkan frame ke WebP"));
    });

    const sticker = fs.readFileSync(webpPath);
    await sock.sendMessage(from, { sticker }, { quoted: msg });

    // Hapus file sementara
    for (const f of framePaths) fs.unlinkSync(f);
    fs.unlinkSync(webpPath);
  } catch (err) {
    console.error("❌ Error attp:", err);
    await sock.sendMessage(from, { text: "❌ Gagal membuat stiker teks berkedip." }, { quoted: msg });
  }
};
