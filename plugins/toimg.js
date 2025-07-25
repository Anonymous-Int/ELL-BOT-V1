// plugins/toimg.js
const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async (sock, msg, args) => {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted?.stickerMessage) {
    return sock.sendMessage(
      msg.key.remoteJid,
      { text: "❌ Balas stiker dengan *!toimg* untuk mengubahnya menjadi gambar." },
      { quoted: msg }
    );
  }

  try {
    const buffer = await downloadMediaMessage(
      { message: { stickerMessage: quoted.stickerMessage } },
      "buffer",
      {},
      { logger: console }
    );

    if (!buffer) throw new Error("Gagal mengunduh stiker.");

    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: buffer,
        caption: "✅ Ini hasil dari stiker!",
      },
      { quoted: msg }
    );
  } catch (err) {
    console.error("❌ Error saat menjalankan 'toimg':", err);
    await sock.sendMessage(
      msg.key.remoteJid,
      { text: "❌ Gagal mengubah stiker menjadi gambar." },
      { quoted: msg }
    );
  }
};
