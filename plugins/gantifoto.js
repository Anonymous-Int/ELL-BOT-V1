// plugins/gantifoto.js
const fs = require("fs");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!isGroup) return sock.sendMessage(from, { text: "❌ Hanya bisa dijalankan di grup." }, { quoted: msg });
  if (!quoted?.imageMessage) return sock.sendMessage(from, { text: "❌ Balas gambar untuk dijadikan foto grup." }, { quoted: msg });

  try {
    const buffer = await sock.downloadMediaMessage({ message: { imageMessage: quoted.imageMessage } });
    await sock.updateProfilePicture(from, buffer);
    await sock.sendMessage(from, { text: "✅ Foto grup berhasil diubah." }, { quoted: msg });
  } catch (err) {
    await sock.sendMessage(from, { text: "❌ Gagal mengganti foto grup." }, { quoted: msg });
  }
};
