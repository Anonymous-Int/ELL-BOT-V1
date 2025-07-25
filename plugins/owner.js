const fs = require("fs");
const path = require("path");

module.exports = async (sock, msg, args, { config }) => {
  const from = msg.key.remoteJid;

  // 📸 Gambar banner
  const bannerPath = path.join(__dirname, "../media/menu.jpeg");
  const bannerBuffer = fs.readFileSync(bannerPath);

  // 📞 Nomor owner
  const ownerNumbers = config.ownerNumber
    .map((num, i) => `📞 Owner ${i + 1}: wa.me/${num}`)
    .join("\n");

  const text = `
╭─〔 👑 *PEMILIK BOT* 〕──⬣
│ 📛 *Nama:* ${config.ownerName}
│ ${ownerNumbers}
│
│ 🌐 *Website:* https://anon.news
│ 📸 *Instagram:* https://instagram.com/jonathan.adventt
│ 💬 *Telegram:* https://t.me/YourAnonymousPost
│ 📍 *Lokasi:* Indonesia
╰────────────⬣

╭─〔 🤖 *TENTANG BOT* 〕──⬣
│ 📌 *Nama Bot:* ${config.namaBot}
│ 🛠️ *Framework:* Node.js + Baileys
│ 🔄 *Update Terakhir:* ${new Date().toLocaleDateString("id-ID")}
╰────────────⬣

📬 *Kontak owner untuk kritik, saran, atau kerja sama.*
`.trim();

  // Kirim pesan dengan tombol (hydratedTemplate)
  await sock.sendMessage(from, {
    image: bannerBuffer,
    caption: text,
    footer: "📍 ELL BOT - WhatsApp Assistant",
    templateButtons: [ // Jika ini tidak bekerja di versimu, ganti ke below version (hydrated buttons)
      {
        index: 1,
        quickReplyButton: {
          displayText: "📜 Menu",
          id: `${config.prefix}menu`,
        }
      },
      {
        index: 2,
        quickReplyButton: {
          displayText: "💰 Donasi",
          id: `${config.prefix}donasi`,
        }
      },
      {
        index: 3,
        urlButton: {
          displayText: "📞 Hubungi Owner",
          url: `https://wa.me/${config.ownerNumber[0]}`,
        }
      }
    ]
  }, { quoted: msg });
};
