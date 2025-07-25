const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const Jimp = require("jimp");
const QrCode = require("qrcode-reader");
const fs = require("fs");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const isImage = msg.message?.imageMessage;

  if (!isImage) {
    return sock.sendMessage(from, {
      text: "❌ Balas gambar QR-code dengan perintah: !scanqr"
    }, { quoted: msg });
  }

  try {
    const stream = await downloadContentFromMessage(msg.message.imageMessage, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const image = await Jimp.read(buffer);
    const qr = new QrCode();

    qr.callback = (err, value) => {
      if (err || !value) {
        sock.sendMessage(from, {
          text: "❌ Gagal membaca QR code."
        }, { quoted: msg });
      } else {
        sock.sendMessage(from, {
          text: `✅ QR-code terdeteksi:\n${value.result}`
        }, { quoted: msg });
      }
    };

    qr.decode(image.bitmap);
  } catch (err) {
    console.error("❌ Error scanqr:", err);
    sock.sendMessage(from, {
      text: "❌ Terjadi kesalahan saat membaca QR code."
    }, { quoted: msg });
  }
};
