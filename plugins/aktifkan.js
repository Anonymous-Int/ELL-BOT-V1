const { updateFitur } = require("../lib/configManager");

module.exports = async (sock, msg, args, { isOwner }) => {
  const from = msg.key.remoteJid;
  if (!isOwner) {
    return sock.sendMessage(from, { text: "❌ Fitur ini hanya untuk owner." }, { quoted: msg });
  }

  const fitur = args[0];
  if (!fitur) {
    return sock.sendMessage(from, { text: "⚠️ Contoh: !aktifkan sticker" }, { quoted: msg });
  }

  updateFitur(fitur, true);
  sock.sendMessage(from, { text: `✅ Fitur *${fitur}* telah diaktifkan.` }, { quoted: msg });
};
