module.exports = async (sock, msg, args, { config }) => {
  await sock.sendMessage(msg.key.remoteJid, { text: `${config.simbol.success} Bot aktif!` }, { quoted: msg });
};
