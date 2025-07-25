// plugins/promote.js
module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ Hanya bisa dijalankan di grup." }, { quoted: msg });
  if (!mentionedJid.length) return sock.sendMessage(from, { text: "❌ Tag orang yang ingin dijadikan admin." }, { quoted: msg });

  try {
    await sock.groupParticipantsUpdate(from, mentionedJid, "promote");
    await sock.sendMessage(from, { text: "✅ Pengguna telah dipromosikan menjadi admin." }, { quoted: msg });
  } catch {
    await sock.sendMessage(from, { text: "❌ Gagal mempromosikan pengguna." }, { quoted: msg });
  }
};
