const express = require('express');
const cors = require('cors');
const mongoose = require('./config/database');
const connectDB = require('./config/database');
const weatherRoutes = require('./routes/weatherRoutes');
const cron = require('node-cron');

const { fetchWeatherDataAndStore } = require('./services/weatherService');


const app = express();

app.use(cors());
app.use(express.json());

cron.schedule('*/5 * * * *', async () => {
    console.log('Fetching weather data...');
    await fetchWeatherDataAndStore();
  });

  
app.use('/api/weather', weatherRoutes);



app.use('/api/summary',weatherRoutes);

connectDB();

module.exports = app;
