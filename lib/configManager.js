const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

function getConfig() {
  const raw = fs.readFileSync(configPath);
  return JSON.parse(raw);
}

function saveConfig(newConfig) {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
}

function updateFitur(namaFitur, status) {
  const config = getConfig();
  config.fiturAktif[namaFitur] = status;
  saveConfig(config);
  return config;
}

module.exports = { getConfig, updateFitur };
