const axios = require('axios');
const Weather = require('../models/Weather');
const DailySummary = require('../models/DailySummary');
require('dotenv').config();

const fetchWeather = async (city, unit = 'metric') => {
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: unit },
    });
    return {
      city,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      mainCondition: data.weather[0].main,
      timestamp: new Date(data.dt * 1000),
    };
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    return null;
  }
};

// In backend/services/weatherService.js

const validateAndFormatWeatherData = (weatherData, unit = 'metric') => {
  if (!weatherData || !Array.isArray(weatherData)) {
    console.warn('Invalid weather data received:', weatherData);
    return [];
  }
  
  return weatherData.filter(Boolean).map(data => {
    const convertTemp = (temp, unit) => {
      if (typeof temp !== 'number' || isNaN(temp)) return null;
      if (unit === 'imperial') {
        return (temp * 9/5) + 32; // Celsius to Fahrenheit
      } else {
        return temp; // Already in Celsius
      }
    };

    const formatDate = (timestamp) => {
      if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        return null;
      }
      return timestamp.toISOString().split('T')[0];
    };

    const temperature = convertTemp(data.temperature, unit);
    const feelsLike = convertTemp(data.feelsLike, unit);
    const formattedDate = formatDate(data.timestamp);

    if (temperature === null || !data.city) {
      console.warn(`Invalid data:`, { city: data.city, temperature, feelsLike, formattedDate });
      return null;
    }

    return {
      ...data,
      city: data.city,
      temperature,
      feelsLike: feelsLike || temperature, // Use temperature if feelsLike is not available
      timestamp: formattedDate
    };
  }).filter(Boolean);
};

const fetchWeatherDataAndStore = async (unit = 'metric') => {
  try {
    const cities = ['City1', 'City2']; // Add your list of cities here
    const weatherData = await Promise.all(cities.map(city => fetchWeather(city, unit)));
    
    if (!weatherData || weatherData.length === 0) {
      console.warn('No weather data fetched');
      return;
    }

    const validatedData = validateAndFormatWeatherData(weatherData, unit);
    if (validatedData.length > 0) {
      await Weather.insertMany(validatedData);
      console.log('Weather data stored successfully');
    } else {
      console.warn('No valid weather data to store');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

const calculateDailySummaries = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let weatherData = await Weather.find({ timestamp: { $gte: today, $lt: tomorrow } });
    weatherData = validateAndFormatWeatherData(weatherData);

    const cityData = weatherData.reduce((acc, data) => {
      if (!acc[data.city]) acc[data.city] = [];
      acc[data.city].push(data);
      return acc;
    }, {});

    const summaries = Object.keys(cityData).map((city) => {
      const cityWeather = cityData[city];
      if (cityWeather.length === 0) return null;

      const avgTemp = cityWeather.reduce((sum, data) => sum + data.temperature, 0) / cityWeather.length;
      const maxTemp = Math.max(...cityWeather.map((data) => data.temperature));
      const minTemp = Math.min(...cityWeather.map((data) => data.temperature));
      const dominantCondition = cityWeather.sort((a, b) =>
        cityWeather.filter((v) => v.mainCondition === a.mainCondition).length -
        cityWeather.filter((v) => v.mainCondition === b.mainCondition).length
      ).pop().mainCondition;

      return {
        city,
        date: cityWeather[0].timestamp.toISOString().split('T')[0],
        avgTemp: parseFloat(avgTemp.toFixed(2)),
        maxTemp: parseFloat(maxTemp.toFixed(2)),
        minTemp: parseFloat(minTemp.toFixed(2)),
        dominantCondition,
      };
    }).filter(Boolean);

    await DailySummary.insertMany(summaries);
    console.log('Daily summaries calculated and stored successfully');
  } catch (error) {
    console.error('Error calculating daily summaries:', error);
  }
};

const logInvalidData = (weatherData) => {
  const invalidData = weatherData.filter(data => 
    data.temperature < -100 || // Unrealistically low temperature
    data.timestamp === null
  );

  if (invalidData.length > 0) {
    console.warn('Invalid weather data detected:');
    console.warn(JSON.stringify(invalidData, null, 2));
  }
};

module.exports = { fetchWeatherDataAndStore, calculateDailySummaries, logInvalidData };