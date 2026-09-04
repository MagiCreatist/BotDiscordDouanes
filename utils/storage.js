const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'service-data.json');

// Structure du fichier :
// { "active": { "userId": timestampDeDebut } }

function loadData() {
  if (!fs.existsSync(DATA_PATH)) {
    return { active: {} };
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Formate une durée en millisecondes en "Xh Ymin"
function formatDuree(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const heures = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (heures === 0) return `${minutes} min`;
  return `${heures}h ${minutes}min`;
}

module.exports = { loadData, saveData, formatDuree };
