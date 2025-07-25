const fs = require("fs");
const path = require("path");


module.exports = async (sock, msg, args, { config }) => {
  const from = msg.key.remoteJid;
  const { prefix, namaBot, ownerName } = config;
  const imagePath = path.join(__dirname, "../media/menu.jpeg");
  const audioPath = path.join(__dirname, "../media/menu-voice.opus");

  const menuText = `
╭━━━〔 *🤖 ${namaBot.toUpperCase()} MENU* 〕━━⬣
┃ 👑 *Owner:* ${ownerName}
┃ ⚙️ *Prefix:* ${prefix}
┃ 📅 *Tanggal:* ${new Date().toLocaleDateString()}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭─❏ *📂 INFORMASI*
│ ${prefix}owner
│ ${prefix}ping
│ ${prefix}runtime
│ ${prefix}rule
│ ${prefix}quote
│ ${prefix}cuaca <kota>
│ ${prefix}kbbi <kata>
│ ${prefix}translate <teks>
╰───────────────⬣

╭─❏ *🖼️ STICKER*
│ ${prefix}sticker
│ ${prefix}stickertext
│ ${prefix}toimg
│ ${prefix}atp <teks>
│ ${prefix}attp <teks>
╰───────────────⬣

╭─❏ *🧠 AI & TOOLS*
│ ${prefix}ai <pertanyaan>
│ ${prefix}nulis <teks>
│ ${prefix}ytsearch <query>
│ ${prefix}short <link>
│ ${prefix}kodeqr
│ ${prefix}scanqr
╰───────────────⬣

╭─❏ *🔊 VOICE*
│ ${prefix}vn
│ ${prefix}toaudio
│ ${prefix}totext
│ ${prefix}say
│ ${prefix}tts
│ ${prefix}filternoise
│ ${prefix}ytsound
╰───────────────⬣

╭─❏ *📥 DOWNLOADER*
│ ${prefix}ytmp3 <url>
│ ${prefix}ytmp4 <url>
│ ${prefix}instagram <url>
│ ${prefix}tiktok <url>
│ ${prefix}twitter <url>
╰───────────────⬣

╭─❏ *👥 GROUP*
│ ${prefix}group buka/tutup
│ ${prefix}tagall
│ ${prefix}kick @user
│ ${prefix}add <nomor>
│ ${prefix}promote @user
│ ${prefix}demote @user
│ ${prefix}antilink on/off
│ ${prefix}gantifoto
│ ${prefix}gantideskripsi
│ ${prefix}gantinama
╰───────────────⬣

╭─❏ *ADMIN ONLY*
│ ${prefix}fitur
│ ${prefix}aktifkan
│ ${prefix}nonaktifkan
╰───────────────⬣

📌 _Ketik_ *${prefix}perintah* _untuk menjalankan fitur._
✨ _Selamat menggunakan ${namaBot}, semoga harimu menyenangkan!_
`.trim();

  // Kirim gambar dan caption menu
  await sock.sendMessage(from, {
    image: fs.readFileSync(imagePath),
    caption: menuText,
  }, { quoted: msg });

  // Kirim voice note (audio)
  await sock.sendMessage(from, {
    audio: fs.readFileSync(audioPath),
    mimetype: 'audio/mpeg',
    ptt: false
  }, { quoted: msg });
};
