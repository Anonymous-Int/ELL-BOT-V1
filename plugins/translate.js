// plugins/translate.js
const translate = require('@vitalets/google-translate-api');


const bahasaTersedia = {
  af: "Afrikaans", sq: "Albanian", ar: "Arabic", az: "Azerbaijani", bn: "Bengali", bs: "Bosnian",
  bg: "Bulgarian", ca: "Catalan", zh: "Chinese", hr: "Croatian", cs: "Czech", da: "Danish",
  nl: "Dutch", en: "English", eo: "Esperanto", et: "Estonian", fi: "Finnish", fr: "French",
  ka: "Georgian", de: "German", el: "Greek", gu: "Gujarati", ha: "Hausa", he: "Hebrew",
  hi: "Hindi", hu: "Hungarian", is: "Icelandic", id: "Indonesian", it: "Italian", ja: "Japanese",
  jw: "Javanese", kn: "Kannada", kk: "Kazakh", ko: "Korean", la: "Latin", lv: "Latvian",
  lt: "Lithuanian", ml: "Malayalam", ms: "Malay", mr: "Marathi", mn: "Mongolian", ne: "Nepali",
  no: "Norwegian", fa: "Persian", pl: "Polish", pt: "Portuguese", pa: "Punjabi", ro: "Romanian",
  ru: "Russian", sr: "Serbian", si: "Sinhala", sk: "Slovak", sl: "Slovenian", es: "Spanish",
  sw: "Swahili", sv: "Swedish", ta: "Tamil", te: "Telugu", th: "Thai", tr: "Turkish",
  uk: "Ukrainian", ur: "Urdu", uz: "Uzbek", vi: "Vietnamese", cy: "Welsh", yo: "Yoruba", zu: "Zulu"
};

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const lang = args[0];
  const teks = args.slice(1).join(" ");

  if (!lang || !teks || !bahasaTersedia[lang.toLowerCase()]) {
    const daftarBahasa = Object.entries(bahasaTersedia)
      .map(([kode, nama]) => `🔹 *${kode}* → ${nama}`)
      .join("\n");

    const bantuan = `
❌ *Format Salah!*
📌 Contoh: !translate en saya lapar

✴️ *Daftar Kode Bahasa:*
${daftarBahasa}

ℹ️ Gunakan kode bahasa di atas untuk menerjemahkan teks.
`.trim();

    return sock.sendMessage(from, { text: bantuan }, { quoted: msg });
  }

  try {
    const res = await translate(teks, { to: lang });

    const hasil = `
┏━━━〔 🌐 *HASIL TERJEMAHAN* 〕━━━⬣
┃
┃ 🗣️ *Teks:* ${teks}
┃ 🌍 *Ke Bahasa:* ${bahasaTersedia[lang.toLowerCase()]} \`(${lang})\`
┃ 📝 *Hasil:* ${res.text}
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

    await sock.sendMessage(from, { text: hasil }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error Translate:", err.message);
    await sock.sendMessage(from, {
      text: "❌ Terjadi kesalahan saat menerjemahkan. Coba lagi nanti."
    }, { quoted: msg });
  }
};
