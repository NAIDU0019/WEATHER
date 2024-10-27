const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const mongoose = require('mongoose');
const Weather = require('../models/Weather'); // Adjust the path as necessary
const { convertKelvinToCelsius } = require('../services/weatherService'); // Adjust the path as necessary
const axios = require('axios');
const { render, screen, waitFor } = require('@testing-library/react');
const React = require('react');
const App = require('../../weather-monitor-frontend/src/App'); // Adjust the path as necessary

jest.mock('axios');

describe('Weather Monitoring System', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('System Setup', () => {
    beforeAll(async () => {
      await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  
    test('connects to OpenWeatherMap API successfully', async () => {
      const response = await request(app).get('/api/weather');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('Data Retrieval', () => {
    test('fetches and displays weather data', async () => {
      const mockWeatherData = [
        {
          city: 'Delhi',
          temperature: 40,
          feelsLike: 42,
          humidity: 10,
          windSpeed: 5,
          mainCondition: 'Sunny',
          timestamp: new Date().toISOString(),
        },
      ];
  
      axios.get.mockResolvedValue({ data: mockWeatherData });
  
      render(<App />);
  
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/weather?unit=metric');
  
      await waitFor(() => {
        const cityElement = screen.getByText(/Delhi/i);
        const temperatureElement = screen.getByText(/Temperature: 40°C/i);
        const conditionElement = screen.getByText(/Condition: Sunny/i);
  
        expect(cityElement).toBeInTheDocument();
        expect(temperatureElement).toBeInTheDocument();
        expect(conditionElement).toBeInTheDocument();
      });
    });
  });

  describe('Temperature Conversion', () => {
  test('converts Kelvin to Celsius correctly', () => {
    const kelvin = 300;
    const celsius = convertKelvinToCelsius(kelvin);
    expect(celsius).toBeCloseTo(26.85, 2);
  });

  test('converts Kelvin to Fahrenheit correctly', () => {
    const kelvin = 300;
    const fahrenheit = (convertKelvinToCelsius(kelvin) * 9/5) + 32;
    expect(fahrenheit).toBeCloseTo(80.33, 2);
  });
});

 describe('Daily Weather Summary', () => {
  test('calculates daily summaries correctly', async () => {
    const mockWeatherData = [
      { city: 'Delhi', temperature: 35, timestamp: new Date() },
      { city: 'Delhi', temperature: 25, timestamp: new Date() },
      { city: 'Mumbai', temperature: 30, timestamp: new Date() },
    ];

    await Weather.insertMany(mockWeatherData);

    const response = await request(app).get('/api/weather/summary');
    const summaries = response.body;

    expect(summaries).toHaveLength(2);
    const delhiSummary = summaries.find(summary => summary.city === 'Delhi');
    expect(delhiSummary.avgTemp).toBeCloseTo(30, 2);
    expect(delhiSummary.maxTemp).toBe(35);
    expect(delhiSummary.minTemp).toBe(25);
    expect(delhiSummary.dominantCondition).toBeDefined();
  });
});


 
describe('Alerting Thresholds', () => {
  test('triggers alerts when temperature exceeds threshold', async () => {
    const mockWeatherData = [
      { city: 'Delhi', temperature: 45, timestamp: new Date().toISOString() },
    ];

    axios.get.mockResolvedValue({ data: mockWeatherData });

    render(<App />);

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/weather?unit=metric');

    await waitFor(() => {
      const alertElement = screen.getByText(/Delhi has exceeded the temperature threshold/i);
      expect(alertElement).toBeInTheDocument();
    });
  });
});