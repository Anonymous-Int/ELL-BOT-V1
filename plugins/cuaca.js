const axios = require("axios");

module.exports = async (sock, msg, args, { config }) => {
  const from = msg.key.remoteJid;
  const kota = args.join(" ");

  if (!kota) {
    return sock.sendMessage(from, { text: "❌ Masukkan nama kota, contoh: !cuaca Jakarta" }, { quoted: msg });
  }

  try {
    const apiKey = config.openWeatherKey;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(kota)}&units=metric&appid=${apiKey}&lang=id`;

    const res = await axios.get(url);
    const data = res.data;

    const weather = data.weather[0];
    const main = data.main;
    const wind = data.wind;

    const result = `
🌦️ Cuaca di *${data.name}*
📍 Lokasi: ${data.name}, ${data.sys.country}
🌡️ Suhu: ${main.temp}°C
💧 Kelembapan: ${main.humidity}%
🌬️ Angin: ${wind.speed} km/jam
⛅ Deskripsi: ${weather.description}
`.trim();

    await sock.sendMessage(from, { text: result }, { quoted: msg });
  } catch (e) {
    console.error("❌ Error Cuaca:", e.message);
    await sock.sendMessage(from, { text: "❌ Gagal mengambil data cuaca atau kota tidak ditemukan." }, { quoted: msg });
  }
};
