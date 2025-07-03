const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  tournamentId: { type: String, required: true },
  game: { type: String, enum: ['bgmi', 'csgo'], required: true }
});

module.exports = mongoose.model('Player', playerSchema);
