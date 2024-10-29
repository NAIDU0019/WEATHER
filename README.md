# Real-Time Data Processing System for Weather Monitoring with Rollups and Aggregates

## Objective
Develop a real-time data processing system to monitor and summarize weather conditions across major cities in India, using rollups and aggregates. The application will continuously retrieve data from the OpenWeatherMap API, enabling users to analyze weather patterns, set alerts, and view trends over time.

## Data Source
The system uses the OpenWeatherMap API to retrieve real-time weather data for select Indian metro cities: Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad. The primary weather parameters tracked include:
- **Main**: Overall weather condition (e.g., Rain, Snow, Clear).
- **Temp**: Current temperature (converted to Celsius).
- **Feels_like**: Perceived temperature (converted to Celsius).
- **Dt**: Timestamp of the data update.

## Features

### 1. Continuous Real-Time Data Retrieval
   - The system will call the OpenWeatherMap API at a configurable interval (default: every 5 minutes) to fetch updated weather data.
   - Temperature values are converted from Kelvin to Celsius or Fahrenheit based on user preference.

### 2. Rollups and Aggregates
#### Daily Weather Summary
   - The system generates daily summaries by aggregating weather data for each city. These summaries include:
      - **Average Temperature**: The mean temperature throughout the day.
      - **Maximum Temperature**: The highest temperature recorded.
      - **Minimum Temperature**: The lowest temperature recorded.
      - **Dominant Weather Condition**: Most frequent weather condition (e.g., Clear or Rain), with reasons provided based on prevalence.
   - Daily summaries are stored in persistent storage for historical analysis.

#### Alerting Thresholds
   - Users can define thresholds for temperature or specific weather conditions.
   - For example, if the temperature exceeds 35°C for two consecutive updates, an alert is triggered.
   - Alerts can be displayed on the console or sent through an email notification system (implementation open to extension).

### 3. Visualization
   - Daily weather summaries, historical trends, and triggered alerts are visualized for easy tracking of weather patterns and analysis.

## Project Structure
```
weather-monitor/
├── backend/
│   ├── config/
│   │   └── database.js               # Database configuration
│   ├── controllers/
│   │   └── weatherController.js      # Controller for handling API logic
│   ├── models/
│   │   ├── Alert.js                  # Alert model
│   │   ├── Weather.js                # Weather data model
│   │   └── DailySummary.js           # Daily summary model
│   ├── routes/
│   │   └── weatherRoutes.js          # API routes
│   ├── services/
│   │   ├── weatherService.js         # Business logic for data processing
│   │   └── openWeatherService.js     # Service for fetching OpenWeatherMap data
│   ├── .env                          # Environment variables
│   ├── app.js                        # Express app setup
│   ├── index.js                      # Main entry point
│   ├── package.json                  # Backend dependencies
│   └── package-lock.json
└── weather-monitor-frontend/
    ├── public/
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── src/
    │   ├── components/
    │   │   ├── Alert.js              # Component to display alerts
    │   │   ├── DailySummary.js       # Component to display daily summaries
    │   │   ├── WeatherCard.js        # Component to display current weather data
    │   │   └── Visualization.js      # Component for visualizations
    │   ├── App.css                   # Global CSS
    │   ├── App.js                    # Main app file
    │   ├── App.test.js               # Frontend tests
    │   ├── api.js                    # API integration
    │   ├── index.css                 # CSS styles
    │   ├── index.js                  # Frontend entry point
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    ├── .env                          # Environment variables
    ├── package.json                  # Frontend dependencies
    ├── package-lock.json
    └── README.md                     # Project documentation
```

## Setup and Installation

### Prerequisites
- Node.js and npm installed
- OpenWeatherMap API key

### Backend
1. Clone the repository and navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   API_KEY=<Your_OpenWeatherMap_API_Key>
   DB_URI=<Your_Database_URI>
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the `weather-monitor-frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variable:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the frontend server:
   ```bash
   npm start
   ```

## Usage

1. Open the frontend in a web browser (`http://localhost:3000` by default).
2. Configure temperature units and alert thresholds.
3. View real-time weather data, daily summaries, and alerts as they are triggered.

## Test Cases

### System Setup
1. Verify the backend connects to the OpenWeatherMap API and retrieves data.
2. Confirm the system starts without errors.

### Data Retrieval and Processing
1. Simulate API calls and ensure weather data is correctly parsed and stored.
2. Verify temperature conversion between Kelvin, Celsius, and Fahrenheit.

### Daily Weather Summaries
1. Simulate data over several days to check for correct average, max, and min temperatures and dominant weather condition.

### Alerting System
1. Configure thresholds and simulate conditions to ensure alerts trigger when appropriate.

## Extensions (Bonus)
- Integrate additional weather parameters such as humidity and wind speed.
- Implement forecasts for future conditions based on OpenWeatherMap’s forecasting API.

## License
This project is licensed under the MIT License.

---

This README provides an overview, installation steps, project structure, and usage guidelines for the Real-Time Weather Monitoring System.
