// plugins/kick.js
module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");
  const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!isGroup) return sock.sendMessage(from, { text: "❌ Perintah ini hanya untuk grup." }, { quoted: msg });
  if (!mentionedJid.length) return sock.sendMessage(from, { text: "❌ Tag anggota yang ingin dikeluarkan." }, { quoted: msg });

  try {
    await sock.groupParticipantsUpdate(from, mentionedJid, "remove");
    await sock.sendMessage(from, { text: "✅ Pengguna dikeluarkan." }, { quoted: msg });
  } catch (err) {
    await sock.sendMessage(from, { text: "❌ Gagal mengeluarkan anggota." }, { quoted: msg });
  }
};
