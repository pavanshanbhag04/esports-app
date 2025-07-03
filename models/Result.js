const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  Trnt_ID: { type: String, required: true },
  bgmi_wnr: Number,
  csgo_wnr: Number,
  bgmi_phone: String,
  csgo_phone: String
});

module.exports = mongoose.model('Result', resultSchema);
