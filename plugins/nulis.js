const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { tmpdir } = require("os");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const teks = args.join(" ").trim();

  if (!teks) {
    return sock.sendMessage(from, {
      text: "❌ Masukkan teks untuk ditulis, contoh: !nulis Aku rajin belajar."
    }, { quoted: msg });
  }

  const maxLineLength = 40;
  const lines = teks.match(new RegExp(`.{1,${maxLineLength}}`, "g")) || [];

  const backgroundPath = path.join(__dirname, "../assets/kertas.jpeg");
  const outputPath = path.join(tmpdir(), `nulis-${Date.now()}.jpeg`);

  if (!fs.existsSync(backgroundPath)) {
    return sock.sendMessage(from, {
      text: "❌ Gambar kertas tidak ditemukan di folder assets."
    }, { quoted: msg });
  }

  try {
    fs.copyFileSync(backgroundPath, outputPath);

    let y = 130;
    const x = 100;
    const spacing = 40;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      await new Promise((resolve, reject) => {
        const convert = spawn("convert", [
          outputPath,
          "-font", "Verdana-Italic", // atau pakai jalur absolut .ttf
          "-pointsize", "22",
          "-fill", "black",
          "-annotate", `+${x}+${y}`, line,
          outputPath
        ]);

        convert.on("exit", (code) => {
          if (code === 0) {
            console.log(`✅ Menulis baris ${i + 1}: "${line}" pada koordinat +${x}+${y}`);
            resolve();
          } else {
            reject(new Error(`❌ Gagal menulis teks ke gambar pada baris ${i + 1}.`));
          }
        });
      });

      y += spacing;
    }

    const imageBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(from, {
      image: imageBuffer,
      caption: "📝 Ini hasil nulisnya!"
    }, { quoted: msg });

    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error("❌ Error nulis:", err);
    await sock.sendMessage(from, {
      text: "❌ Terjadi kesalahan saat menulis ke gambar."
    }, { quoted: msg });
  }
};
