const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.js");

const config = {
  namaBot: "ELL BOT V1",
  ownerName: "MOJO (Jonathan Advent)",
  ownerNumber: ["6285652022371", "6282256917838"], // Tanpa +, gunakan format internasional
  prefix: "!",
  simbol: {
    menu: "📜",
    info: "ℹ️",
    success: "✅",
    error: "❌",
    loading: "⏳",
  },
  watermark: "ELL MOJO • WhatsApp Bot 2025",

  // 🔑 Tambahkan API Key Cuaca (dari https://openweathermap.org/api)
  openWeatherKey: "8eeb727bfaff50df594f3927549d916d",

  // ✅ Konfigurasi fitur (true = aktif, false = nonaktif)
  fitur: {
    
    atp: true,
    attp: true,
    sticker: true,
    stickertext: true,
    toimg: true,
    ai: true,
    nulis: true,
    ytsearch: true,
    short: true,
    kodeqr: true,
    scanqr: true,
    vn: true,
    toaudio: true,
    totext: true,
    say: true,
    tts: true,
    filternoise: true,
    ytsound: true,
    ytmp3: true,
    ytmp4: true,
    instagram: true,
    tiktok: true,
    twitter: true,
    tagall: true,
    kick: true,
    add: true,
    promote: true,
    demote: true,
    antilink: true,
    gantinama: true,
    gantifoto: true,
    gantideskripsi: true,
    owner: true,
    ping: true,
    runtime: true,
    rule: true,
    quote: true,
    cuaca: true,
    kbbi: true,
    translate: true,
    menu: true
  },

  // 🧠 Fungsi untuk memperbarui status fitur dari plugin
  updateFitur(nama, status) {
    if (!this.fitur) this.fitur = {};
    this.fitur[nama] = status;

    try {
      const file = fs.readFileSync(configPath, "utf-8");

      // Gunakan regex untuk ganti nilai fitur di file secara langsung
      const regex = new RegExp(`(${nama}\\s*:\\s*)(true|false)`, "i");
      const updated = file.replace(regex, `$1${status}`);

      fs.writeFileSync(configPath, updated, "utf-8");
      console.log(`✅ Fitur '${nama}' telah diperbarui menjadi ${status}`);
    } catch (err) {
      console.error("❌ Gagal menyimpan perubahan ke config.js:", err.message);
    }
  }
};

module.exports = config;
