const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema({
    city: String,
    avgTemp: Number,
    maxTemp: Number,
    minTemp: Number,
    dominantCondition: String,
});

const DailySummary = mongoose.model('DailySummary', dailySummarySchema);

module.exports = DailySummary;