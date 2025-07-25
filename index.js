require("dotenv").config();
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const { Boom } = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const config = require("./config");

// 🔁 Loader Plugin dari folder /plugins
const plugins = {};
const loadPlugins = () => {
  const pluginDir = path.join(__dirname, "plugins");
  const files = fs.readdirSync(pluginDir).filter((file) => file.endsWith(".js"));
  for (const file of files) {
    const name = file.split(".")[0];
    try {
      delete require.cache[require.resolve(`./plugins/${file}`)];
      plugins[name] = require(`./plugins/${file}`);
    } catch (err) {
      console.error(`❌ Gagal memuat plugin ${file}:`, err.message);
    }
  }
};
loadPlugins();

// 🔄 Auto-reload plugin saat diubah
fs.watch(path.join(__dirname, "plugins"), (event, filename) => {
  if (filename.endsWith(".js")) {
    console.log(`🔃 Plugin diperbarui: ${filename}`);
    loadPlugins();
  }
});

(async () => {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["MyBot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr, pairingCode } = update;

    if (qr) {
      console.log("\n📲 Scan QR Code:\n");
      qrcode.generate(qr, { small: true });
    }

    if (pairingCode) {
      console.log("\n🔗 Pairing Code:\n");
      console.log(pairingCode);
    }

    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Terputus. Reconnect:", shouldReconnect);
      if (shouldReconnect) {
        require("child_process").spawn("node", ["index.js"], {
          stdio: "inherit",
          shell: true,
        });
      }
    }

    if (connection === "open") {
      console.log("✅ Bot berhasil terhubung ke WhatsApp!");
    }
  });

  // 📥 Handler Pesan Masuk
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const senderName = msg.pushName || "Pengguna";
    const type = Object.keys(msg.message)[0];
    const body =
      msg.message.conversation ||
      msg.message[type]?.text ||
      msg.message[type]?.caption ||
      "";

    const { prefix, simbol, ownerNumber, fitur, updateFitur } = config;

    console.log(`📩 Pesan dari ${senderName} (${from}): ${body}`);
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 👑 Cek apakah pengirim adalah owner
    const isOwner = ownerNumber.includes(sender.replace(/[^0-9]/g, ""));

    // 🔧 Config Manager (aktifkan/nonaktifkan)
    if (["aktifkan", "nonaktifkan"].includes(command)) {
      if (!isOwner) {
        return sock.sendMessage(from, { text: `${simbol.error} Hanya owner yang bisa mengubah fitur.` }, { quoted: msg });
      }
      const fiturTarget = args[0];
      if (!fiturTarget || fitur[fiturTarget] === undefined) {
        return sock.sendMessage(from, { text: `${simbol.error} Fitur *${fiturTarget}* tidak ditemukan.` }, { quoted: msg });
      }
      const statusBaru = command === "aktifkan";
      updateFitur(fiturTarget, statusBaru);
      return sock.sendMessage(from, { text: `${simbol.success} Fitur *${fiturTarget}* berhasil ${statusBaru ? "diaktifkan" : "dinonaktifkan"}.` }, { quoted: msg });
    }

    // ⚙️ Eksekusi plugin biasa
    if (plugins[command]) {
      // ❌ Cek apakah fitur dinonaktifkan
      if (fitur[command] === false) {
  try {
    await require("./plugins/nonaktifkan")(sock, msg, args, {
      config,
      fiturNama: command
    });
  } catch (err) {
    console.error("❌ Gagal menampilkan pesan nonaktif:", err.message);
    await sock.sendMessage(from, {
      text: `${simbol.error} Fitur *${command}* sedang dinonaktifkan.`,
    }, { quoted: msg });
  }
  return;
}


      console.log(`✅ Menjalankan perintah: ${command}`);
      try {
        await plugins[command](sock, msg, args, { config, isOwner });
      } catch (e) {
        console.error(`❌ Error saat menjalankan '${command}':`, e.message);
        await sock.sendMessage(from, {
          text: `${simbol.error} Terjadi kesalahan saat menjalankan perintah *${command}*.`,
        }, { quoted: msg });
      }
    } else {
      console.log(`❌ Perintah tidak ditemukan: ${command}`);
      await sock.sendMessage(from, {
        text: `${simbol.error} Perintah *${prefix}${command}* tidak ditemukan.`,
      }, { quoted: msg });
    }
  });
})();
