# 🤖 ELL-BOT-V1 - WhatsApp Multi-Fitur Bot

![Logo](https://img.shields.io/badge/ELL--BOT--V1-WA%20Bot-green?style=flat-square&logo=whatsapp)

**ELL-BOT-V1** adalah bot WhatsApp berbasis Node.js dengan banyak fitur seperti AI Chat, Downloader, Group Admin, Sticker Maker, Voice Tools, dan lainnya. Cocok untuk kebutuhan pribadi maupun komunitas.

---

## 📦 Fitur Utama

- 🤖 Chat AI (OpenAI)
- 🎵 Downloader (YouTube, TikTok, Instagram, Twitter)
- 🎙️ Voice Tools (Text to Speech, Convert Audio, Filter Noise)
- 📜 Translate & KBBI
- 📸 Sticker Maker & Image Tools
- ⏱️ Runtime, Ping, Tagall, Group Settings
- 🔒 Fitur Admin & Anti-Link

---
## 🔧 Instalasi Bot
---
### 📱 Termux (Android)

```bash
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg imagemagick tesseract termux-api python -y
pip install gTTS
pip install git+https://github.com/pndurette/gTTS.git
git clone https://github.com/Anonymous-Int/ELL-BOT-V1.git
cd ELL-BOT-V1
npm install
node index.js
```
---
### 💻 Linux (Ubuntu/Debian)
---

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm git ffmpeg webp imagemagick tesseract-ocr python3 python3-pip -y
pip install gTTS
pip install git+https://github.com/pndurette/gTTS.git
git clone https://github.com/Anonymous-Int/ELL-BOT-V1.git
cd ELL-BOT-V1
npm install
node index.js
```

---
### ⚙️ Konfigurasi .env
Buat file .env seperti berikut:
---

```bash
PREFIX=!
NAMA_BOT=ELL-BOT
OWNER_NAME=Jonathan
OWNER_NUMBER=628xxxxxxx,628xxxxxxx
SESSION_FILE=session.json
OPENAI_API_KEY=your_openai_api_key
```
---

### 📷 Screenshot

---


---

## 🚀 2. **Cara Deploy ke VPS (Contoh: Ubuntu 22.04)**

Berikut langkah-langkah lengkap untuk **hosting bot di VPS** agar berjalan 24/7:

### ✅ A. Persiapan VPS

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm git ffmpeg webp imagemagick tesseract-ocr python3 python3-pip -y
pip install gTTS
pip install git+https://github.com/pndurette/gTTS.git
```
---

### ✅ B. Clone Repo dan Jalankan
```bash
git clone https://github.com/Anonymous-Int/ELL-BOT-V1.git
cd ELL-BOT-V1
npm install
nano .env    # <-- buat atau edit file konfigurasi
node index.js
```
---
✅ C. Menjalankan Bot 24/7 dengan pm2
```bash
sudo npm install -g pm2
pm2 start index.js --name ell-bot
pm2 save
pm2 startup
```
