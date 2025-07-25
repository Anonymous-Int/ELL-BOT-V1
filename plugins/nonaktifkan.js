const fs = require("fs");
const path = require("path");

const bannerPath = path.join(__dirname, "../media/menu.jpeg"); // Gambar banner

module.exports = async (sock, msg, args, extra) => {
  const { config, fiturNama } = extra;

  const sender = msg.pushName || "Pengguna";
  const isGroup = msg.key.remoteJid.endsWith("@g.us");

  // Kirim banner jika ada
  if (fs.existsSync(bannerPath)) {
    await sock.sendMessage(msg.key.remoteJid, {
      image: fs.readFileSync(bannerPath),
      caption:
        `🚫 Fitur *${fiturNama}* sedang dinonaktifkan oleh Owner!\n\n` +
        `👤 Pengguna: *${sender}*\n` +
        `📛 Fitur: *${fiturNama}*\n\n` +
        `📞 Silakan hubungi *Owner* untuk informasi lebih lanjut:\n` +
        `${config.ownerNumber.map((n) => `- wa.me/${n}`).join("\n")}`,
    }, { quoted: msg });
  } else {
    await sock.sendMessage(msg.key.remoteJid, {
      text:
        `🚫 Fitur *${fiturNama}* sedang dinonaktifkan oleh Owner!\n\n` +
        `📞 Hubungi Owner:\n` +
        `${config.ownerNumber.map((n) => `- wa.me/${n}`).join("\n")}`,
    }, { quoted: msg });
  }
};
