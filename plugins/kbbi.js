const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const kata = args.join(" ").toLowerCase();

  if (!kata) {
    return sock.sendMessage(from, { text: "❌ Masukkan kata yang ingin dicari!\n\nContoh: !kbbi rumah" }, { quoted: msg });
  }

  try {
    const url = `https://kbbi.kemdikbud.go.id/entri/${kata}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const arti = $("ol > li").map((i, el) => `🔸 ${$(el).text().trim()}`).get();

    if (arti.length > 0) {
      const hasil = `📚 *KBBI – ${kata}*\n━━━━━━━━━━━━━━━━━━\n${arti.join("\n")}`;
      return sock.sendMessage(from, { text: hasil }, { quoted: msg });
    } else {
      // Cek apakah ada saran entri
      const saran = $("a").map((i, el) => $(el).text().trim()).get()
        .filter(t => t && t.toLowerCase() !== kata && t.length <= 20)
        .slice(0, 5);

      let teks = `❌ Kata "*${kata}*" tidak ditemukan di KBBI.`;

      if (saran.length > 0) {
        teks += `\n\n🔍 Mungkin maksud kamu:\n${saran.map(s => `🔹 ${s}`).join("\n")}`;
      }

      return sock.sendMessage(from, { text: teks }, { quoted: msg });
    }
  } catch (err) {
    console.error("❌ Error KBBI:", err.message);
    return sock.sendMessage(from, { text: "❌ Terjadi kesalahan saat mencari kata di KBBI." }, { quoted: msg });
  }
};
