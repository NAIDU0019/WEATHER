const express = require('express');
const { fetchWeather } = require('../services/openWeatherService');

const { fetchWeatherDataAndStore } = require('../services/weatherService');
const DailySummary = require('../models/DailySummary');

const router = express.Router();

router.get('/weather', async (req, res) => {
    try {
        await fetchWeatherDataAndStore();
        res.send('Weather data updated');
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

router.get('/summary', async (req, res) => {
    try {
        const summaries = await DailySummary.find({});
        res.json(summaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching daily summaries' });
    }
});
router.get('/', async (req, res) => {
    const unit = req.query.unit || 'metric'; // Default to Celsius
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    try {
        const weatherData = await Promise.all(cities.map((city) => fetchWeather(city, unit)));
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;