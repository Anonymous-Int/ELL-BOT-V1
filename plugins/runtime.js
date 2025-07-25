const moment = require("moment");
require("moment-duration-format");
const startTime = Date.now();

module.exports = async (sock, msg) => {
  const duration = moment.duration(Date.now() - startTime).format("D [hari], H [jam], m [menit], s [detik]");
  await sock.sendMessage(msg.key.remoteJid, { text: `⏱ Runtime bot: ${duration}` }, { quoted: msg });
};