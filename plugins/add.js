// plugins/add.js
module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");
  const nomor = args[0]?.replace(/\D/g, "");

  if (!isGroup) return sock.sendMessage(from, { text: "❌ Perintah ini hanya untuk grup." }, { quoted: msg });
  if (!nomor) return sock.sendMessage(from, { text: "❌ Masukkan nomor yang ingin ditambahkan. Contoh: !add 628123xxxx" }, { quoted: msg });

  const jid = `${nomor}@s.whatsapp.net`;

  try {
    await sock.groupParticipantsUpdate(from, [jid], "add");
    await sock.sendMessage(from, { text: "✅ Pengguna berhasil ditambahkan." }, { quoted: msg });
  } catch (err) {
    await sock.sendMessage(from, { text: "❌ Gagal menambahkan pengguna." }, { quoted: msg });
  }
};
