const axios = require('axios');

async function fetchWeather(city, unit = 'metric') {
  const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: unit },
  });
  return {
    city,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,            // Added humidity
    windSpeed: data.wind.speed,
    mainCondition: data.weather[0].main,
    timestamp: new Date(data.dt * 1000),
  };
}


module.exports = { fetchWeather };
