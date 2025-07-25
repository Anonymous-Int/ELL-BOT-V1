# 🤖 ELL BOT V1 - WhatsApp Bot dengan Baileys

Bot WhatsApp multifungsi yang dibuat dengan [Baileys](https://github.com/WhiskeySockets/Baileys), Node.js, dan dikembangkan agar mudah dipasang di Termux dan Linux.

---

## 📌 Fitur Utama

* Konversi foto ke stiker dan sebaliknya
* Unduh video dan musik dari YouTube, TikTok, Instagram, Twitter
* ChatGPT AI, Translate, KBBI, Cuaca, QR Code
* Fitur grup: tagall, kick, add, promote, demote, antilink
* Fitur suara: voice note, text-to-speech, totext, filter noise
* Owner Panel dan Menu konfigurasi

---

## 📥 Instalasi di Termux (Android)

```bash
pkg update && pkg upgrade
pkg install nodejs git ffmpeg
pkg install libwebp imagemagick
pkg install tesseract
pkg install yarn

# Clone repo
git clone https://github.com/Anonymous-Int/ELL-BOT-V1.git
cd ELL-BOT-V1

# Install dependency
yarn install

# Jalankan bot
node index.js
```

---

## 📥 Instalasi di Linux (Ubuntu/Debian)

```bash
sudo apt update && sudo apt upgrade
sudo apt install nodejs npm git ffmpeg webp imagemagick tesseract-ocr -y

# Clone repo
git clone https://github.com/Anonymous-Int/ELL-BOT-V1.git
cd ELL-BOT-V1

# Install dependency
npm install

# Jalankan bot
node index.js
```

---

## ⚙️ Konfigurasi

Buka file `config.js` untuk:

* Mengatur nama bot, owner, prefix, simbol
* Mengaktifkan/nonaktifkan fitur
* Mengatur API key cuaca dari OpenWeather

### Contoh:

```js
module.exports = {
  namaBot: "ELL BOT",
  ownerName: "Jonathan Advent",
  ownerNumber: ["6281234567890"],
  prefix: "!",
  openWeatherKey: "API_KEY_KAMU",
  fitur: {
    sticker: true,
    ai: true,
    ytmp3: true,
    ...
  }
};
```

---

## 📦 Struktur Folder

```
ELL-BOT-V1/
├── index.js
├── config.js
├── plugins/        # Folder berisi semua fitur
├── media/          # Gambar banner, thumbnail, dll
├── session/        # Data sesi WhatsApp
├── .gitignore
├── package.json
```

---

## 🛡️ Jangan Lupa

* Jangan upload file `session.json` atau folder `node_modules` ke GitHub
* Pastikan `.gitignore` berisi:

```
node_modules
session.json
.env
```

---

## 👑 Owner & Info Kontak

* Nama: Jonathan Advent
* Website: [https://anon.news](https://anon.news)
* WhatsApp: wa.me/6285652022371
* Telegram: [https://t.me/YourAnonymousPost](https://t.me/YourAnonymousPost)

---

## ⭐ Credit

* [Baileys by WhiskeySockets](https://github.com/WhiskeySockets/Baileys)
* [OpenAI](https://openai.com)
* [OpenWeather](https://openweathermap.org)

---

> Dibuat dengan ❤️ oleh Anonymous-Int / Jonathan Advent
