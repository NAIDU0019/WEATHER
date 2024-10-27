const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  severity: { type: String, required: true }
});

module.exports = mongoose.model('Alert', AlertSchema, 'alerts');
