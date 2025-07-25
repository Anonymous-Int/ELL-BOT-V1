// plugins/gantinama.js
module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const newName = args.join(" ");
  const isGroup = from.endsWith("@g.us");

  if (!isGroup) return sock.sendMessage(from, { text: "❌ Hanya bisa dijalankan di grup." }, { quoted: msg });
  if (!newName) return sock.sendMessage(from, { text: "❌ Masukkan nama baru grup. Contoh: !gantinama Grup Keren" }, { quoted: msg });

  try {
    await sock.groupUpdateSubject(from, newName);
    await sock.sendMessage(from, { text: "✅ Nama grup berhasil diubah." }, { quoted: msg });
  } catch (err) {
    await sock.sendMessage(from, { text: "❌ Gagal mengganti nama grup." }, { quoted: msg });
  }
};
