module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;

  // Periksa apakah ini grup
  if (!msg.key.remoteJid.endsWith("@g.us")) {
    return sock.sendMessage(from, { text: "❌ Perintah ini hanya untuk grup." }, { quoted: msg });
  }

  // Periksa perintah: buka / tutup
  const command = args[0]?.toLowerCase();
  if (!["buka", "tutup"].includes(command)) {
    return sock.sendMessage(from, {
      text: "❌ Gunakan perintah: *!group buka* atau *!group tutup*"
    }, { quoted: msg });
  }

  // Ambil data grup
  const metadata = await sock.groupMetadata(from);
  const sender = msg.key.participant || msg.key.remoteJid;

  const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);
  const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
  const isBotAdmin = metadata.participants.some(p => p.id === botNumber && p.admin);

  if (!isAdmin) {
    return sock.sendMessage(from, { text: "❌ Kamu harus admin untuk menggunakan perintah ini." }, { quoted: msg });
  }

  if (!isBotAdmin) {
    return sock.sendMessage(from, { text: "❌ Bot harus jadi admin untuk mengatur grup." }, { quoted: msg });
  }

  // Eksekusi buka/tutup grup
  const groupSettingUpdate = command === "buka" ? "not_announcement" : "announcement";

  await sock.groupSettingUpdate(from, groupSettingUpdate);

  return sock.sendMessage(from, {
    text: `✅ Grup berhasil di *${command === "buka" ? "buka" : "tutup"}*.`
  }, { quoted: msg });
};
