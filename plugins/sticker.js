const sharp = require("sharp");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;

  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage;

  if (!isImage) {
    return sock.sendMessage(from, { text: '❌ Balas gambar dengan perintah !sticker' }, { quoted: msg });
  }

  try {
    const mediaMsg = {
      key: {
        remoteJid: msg.key.remoteJid,
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
        participant: msg.message.extendedTextMessage.contextInfo.participant,
      },
      message: quoted,
    };

    const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {}, { reuploadRequest: sock });

    const webpBuffer = await sharp(buffer)
      .resize(512, 512, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp()
      .toBuffer();

    await sock.sendMessage(from, { sticker: webpBuffer }, { quoted: msg });
  } catch (err) {
    console.error("❌ Error sticker:", err);
    await sock.sendMessage(from, { text: "❌ Gagal membuat stiker." }, { quoted: msg });
  }
};
