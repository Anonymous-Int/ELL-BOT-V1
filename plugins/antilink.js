// plugins/antilink.js
let antilinkState = {};

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith("@g.us");
  const isAdmin = msg.key.participant === msg.message?.senderKeyDistributionMessage?.groupAdmin;

  if (!isGroup) return sock.sendMessage(from, { text: "❌ Hanya bisa dijalankan di grup." }, { quoted: msg });

  const status = args[0]?.toLowerCase();
  if (status === "on") {
    antilinkState[from] = true;
    sock.sendMessage(from, { text: "✅ Antilink diaktifkan." }, { quoted: msg });
  } else if (status === "off") {
    delete antilinkState[from];
    sock.sendMessage(from, { text: "✅ Antilink dinonaktifkan." }, { quoted: msg });
  } else {
    sock.sendMessage(from, { text: "❌ Gunakan `!antilink on` atau `!antilink off`." }, { quoted: msg });
  }
};

module.exports.antilinkHandler = async (sock, msg) => {
  const from = msg.key.remoteJid;
  if (!antilinkState[from]) return;

  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
  if (text.match(/chat\.whatsapp\.com\/[A-Za-z0-9]{20,24}/)) {
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const sender = msg.key.participant;
      const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

      if (!isAdmin) {
        await sock.sendMessage(from, { text: "⚠️ Link terdeteksi, pengguna akan dikeluarkan." }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [sender], "remove");
      }
    } catch (err) {
      console.error("❌ Gagal mengeksekusi antilink:", err);
    }
  }
};
