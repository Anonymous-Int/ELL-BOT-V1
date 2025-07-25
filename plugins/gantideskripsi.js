// plugins/gantideskripsi.js
module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const newDesc = args.join(" ");
  const isGroup = from.endsWith("@g.us");

  if (!isGroup) return sock.sendMessage(from, { text: "❌ Hanya bisa dijalankan di grup." }, { quoted: msg });
  if (!newDesc) return sock.sendMessage(from, { text: "❌ Masukkan deskripsi baru. Contoh: !gantideskripsi Selamat datang di grup." }, { quoted: msg });

  try {
    await sock.groupUpdateDescription(from, newDesc);
    await sock.sendMessage(from, { text: "✅ Deskripsi grup berhasil diubah." }, { quoted: msg });
  } catch (err) {
    await sock.sendMessage(from, { text: "❌ Gagal mengganti deskripsi grup." }, { quoted: msg });
  }
};
