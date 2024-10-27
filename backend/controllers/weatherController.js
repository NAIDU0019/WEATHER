const Weather = require('../models/Weather');
const { fetchWeather } = require('../services/openWeatherService');

const convertKelvinToCelsius = (kelvin) => kelvin - 273.15;

async function getWeatherData(req, res) {
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
  try {
    const weatherData = await Promise.all(cities.map(fetchWeather));
    await Weather.insertMany(weatherData);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



module.exports = { getWeatherData };

