const fs = require("fs");
const path = require("path");

module.exports = async (sock, msg, args, { config }) => {
  const from = msg.key.remoteJid;
  const { namaBot, ownerName, ownerNumber } = config;

  // Kirim banner foto terlebih dahulu
  const bannerPath = path.join(__dirname, "../media/menu.jpeg");
  if (fs.existsSync(bannerPath)) {
    const bannerBuffer = fs.readFileSync(bannerPath);
    await sock.sendMessage(from, {
      image: bannerBuffer,
      caption: `🛡️ *WELCOME TO ${namaBot.toUpperCase()}* 🛡️\n📜 Berikut adalah peraturan bot:`,
    }, { quoted: msg });
  }

  // Kirim peraturan sebagai pesan teks
  const rules = `
┏━━━━━━━━━━━━━━━┓
┃ ⚠️ *PERATURAN BOT* ⚠️
┗━━━━━━━━━━━━━━━┛

1. 🚫 Jangan spam command.
2. 🚫 Jangan telepon bot.
3. 🚫 Jangan kirim konten SARA / NSFW.
4. 📵 Bot bisa keluar jika melanggar aturan.
5. 🛠️ Laporkan bug ke owner.
6. ✅ Gunakan dengan bijak.

┏━━━━━━━━━━━━━━━┓
┃ ℹ️ *INFORMASI BOT* ℹ️
┗━━━━━━━━━━━━━━━┛

🤖 *Nama Bot:* ${namaBot}
👤 *Owner:* ${ownerName}
📞 *Nomor Owner:* wa.me/${ownerNumber}
📆 *Aktif 24 Jam:* Ya
🛡️ *Status:* Online

━━━━━━━━━━━━━━━━━━━━━━
Dengan menggunakan layanan ini, berarti kamu setuju dengan aturan yang berlaku.

🙏 Terima kasih telah menggunakan *${namaBot}*!
`;

  await sock.sendMessage(from, { text: rules.trim() }, { quoted: msg });
};
