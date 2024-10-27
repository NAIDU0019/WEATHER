const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  feelsLike: Number,
  humidity: Number,          // Added humidity
  windSpeed: Number,         // Added wind speed
  mainCondition: String,
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Weather', weatherSchema);
