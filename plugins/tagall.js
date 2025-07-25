module.exports = async (sock, msg, args, store) => {
  const from = msg.key.remoteJid;

  if (!msg.key.participant || !msg.key.remoteJid.endsWith("@g.us")) {
    return sock.sendMessage(from, { text: "❌ Perintah ini hanya bisa digunakan di grup." }, { quoted: msg });
  }

  const metadata = await sock.groupMetadata(from);
  const participants = metadata.participants.map(p => p.id);
  const text = args.join(" ") || "📢 Tag semua anggota:";

  const mentions = participants;
  await sock.sendMessage(from, {
    text,
    mentions
  }, { quoted: msg });
};
