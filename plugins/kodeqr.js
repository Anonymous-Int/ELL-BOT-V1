const QRCode = require("qrcode");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
  const teks = body.trim().split(" ").slice(1).join(" ");

  if (!teks) {
    return sock.sendMessage(from, {
      text: "❌ Masukkan teks untuk dijadikan QR code, contoh:\n!kodeqr Halo Dunia"
    }, { quoted: msg });
  }

  try {
    const qrBuffer = await QRCode.toBuffer(teks, { type: "png" });

    await sock.sendMessage(from, {
      image: qrBuffer,
      caption: `✅ QR Code untuk:\n${teks}`
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error kodeqr:", err);
    await sock.sendMessage(from, {
      text: "❌ Gagal membuat QR Code."
    }, { quoted: msg });
  }
};
