const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "../config.js");

module.exports = async (sock, msg, args, { config }) => {
  const from = msg.key.remoteJid;
  const sender = msg.pushName || "User";
  const isOwner = msg.key.participant === config.ownerNumber || msg.key.remoteJid.includes(config.ownerNumber);

  if (!isOwner) {
    return sock.sendMessage(from, { text: `${config.simbol.error} Hanya owner yang bisa mengubah status fitur.` }, { quoted: msg });
  }

  const [fiturName, status] = args;
  if (!fiturName || (status !== "true" && status !== "false")) {
    return sock.sendMessage(from, {
      text: `${config.simbol.info} Format:\n${config.prefix}fitur <nama_fitur> <true/false>`,
    }, { quoted: msg });
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const updated = raw.replace(
      new RegExp(`(${fiturName}\\s*:\\s*)(true|false)`, "i"),
      `$1${status}`
    );

    fs.writeFileSync(configPath, updated);

    sock.sendMessage(from, {
      text: `${config.simbol.success} Fitur *${fiturName}* berhasil diubah ke *${status}*.`,
    }, { quoted: msg });
  } catch (err) {
    console.error(err);
    sock.sendMessage(from, {
      text: `${config.simbol.error} Gagal mengubah fitur.`,
    }, { quoted: msg });
  }
};
