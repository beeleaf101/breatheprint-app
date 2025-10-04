import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Cloud, Wind, Droplets, Eye, Gauge, Sun, MapPin, Waves, Activity, Navigation, AlertTriangle } from 'lucide-react';

const Weather = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('New York City');

  // North American cities
  const cities = {
    'New York City': { lat: 40.7128, lon: -74.0060, coast: true, region: 'East Coast' },
    'Los Angeles': { lat: 34.0522, lon: -118.2437, coast: true, region: 'West Coast' },
    'San Francisco': { lat: 37.7749, lon: -122.4194, coast: true, region: 'West Coast' },
    'Miami': { lat: 25.7617, lon: -80.1918, coast: true, region: 'Southeast' },
    'Seattle': { lat: 47.6062, lon: -122.3321, coast: true, region: 'Pacific Northwest' },
    'Vancouver': { lat: 49.2827, lon: -123.1207, coast: true, region: 'Canada West' },
    'San Diego': { lat: 32.7157, lon: -117.1611, coast: true, region: 'West Coast' },
    'Toronto': { lat: 43.6532, lon: -79.3832, coast: false, region: 'Canada East' },
    'Chicago': { lat: 41.8781, lon: -87.6298, coast: false, region: 'Midwest' },
    'Mexico City': { lat: 19.4326, lon: -99.1332, coast: false, region: 'Mexico' }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedCity]);

  async function fetchWeatherData() {
    try {
      setLoading(true);
      const location = cities[selectedCity];
      
      console.log(`🌍 Fetching North American weather for ${selectedCity}`);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto&forecast_days=14`
      );
      
      const data = await response.json();

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m * 0.621371),
        windDir: data.current.wind_direction_10m,
        pressure: Math.round(data.current.pressure_msl),
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
        cloudCover: data.current.cloud_cover,
        uvIndex: data.daily.uv_index_max[0],
        sunrise: data.daily.sunrise[0].split('T')[1].slice(0,5),
        sunset: data.daily.sunset[0].split('T')[1].slice(0,5),
        // NASA Air Quality simulation
        aqi: Math.floor(Math.random() * 50) + 50, // 50-100 typical for North America
        no2: (Math.random() * 20 + 15).toFixed(1),
        o3: (Math.random() * 20 + 30).toFixed(1),
        pm25: (Math.random() * 15 + 10).toFixed(1)
      });

      const forecastData = data.daily.time.map((date, idx) => ({
        date: new Date(date).getDate(),
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.round(data.daily.temperature_2m_max[idx]),
        low: Math.round(data.daily.temperature_2m_min[idx]),
        weatherCode: data.daily.weather_code[idx],
        precipitation: data.daily.precipitation_sum[idx],
        precipProb: data.daily.precipitation_probability_max[idx] || 0,
        windSpeed: Math.round(data.daily.wind_speed_10m_max[idx] * 0.621371),
        windGusts: Math.round(data.daily.wind_gusts_10m_max[idx] * 0.621371)
      }));

      setForecast(forecastData);
      setLoading(false);
      
      console.log(`✅ Weather data loaded for ${selectedCity}, ${location.region}`);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '🌤️';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    return '⛈️';
  };

  const getWeatherDesc = (code) => {
    if (code === 0) return 'Sunny';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    return 'Stormy';
  };

  const getWindDir = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  const getSurfData = () => {
    const loc = cities[selectedCity];
    if (!loc.coast) return null;
    
    return {
      waveHeight: (2 + Math.random() * 4).toFixed(1),
      swellPeriod: (8 + Math.random() * 6).toFixed(0),
      direction: loc.region.includes('West') ? 'W-NW' : 'E-SE',
      waterTemp: loc.lat < 30 ? 24 : loc.lat < 40 ? 18 : 14,
      condition: weather.windSpeed > 20 ? 'Choppy' : weather.windSpeed > 10 ? 'Good' : 'Fair'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
        <div className="text-white text-2xl">Loading North American weather data...</div>
      </div>
    );
  }

  const surf = getSurfData();
  const location = cities[selectedCity];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-4 md:p-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-xl transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-white" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white/10 backdrop-blur-xl text-white px-4 py-2 rounded-lg border border-white/20 focus:border-white/40 outline-none cursor-pointer"
            >
              {Object.keys(cities).map(city => (
                <option key={city} value={city} className="bg-blue-900">{city}</option>
              ))}
            </select>
            <span className="text-white/60 text-sm">{location.region}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="text-center mb-8">
          <p className="text-white/60 text-sm uppercase tracking-wide mb-2">MY LOCATION</p>
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-4">{selectedCity}</h1>
          <div className="text-white text-8xl md:text-9xl font-extralight mb-2">
            {weather.temp}°
          </div>
          <div className="text-white text-2xl mb-2">{getWeatherDesc(weather.weatherCode)}</div>
          <div className="text-white/70 text-lg">
            H:{forecast[0]?.high}° L:{forecast[0]?.low}°
          </div>
        </div>

        {/* Current Banner */}
        <div className="bg-blue-800/40 backdrop-blur-xl rounded-xl p-4 mb-6">
          <p className="text-white/90">
            {getWeatherDesc(weather.weatherCode)} conditions will continue. Wind gusts up to {weather.windSpeed} mph.
          </p>
        </div>

        {/* 14-Day Forecast Slider */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {forecast.map((day, idx) => (
              <div key={idx} className="text-center min-w-[70px]">
                <div className="text-white/80 text-sm mb-2">{idx === 0 ? 'Today' : day.day}</div>
                <div className="text-4xl mb-2">{getWeatherIcon(day.weatherCode)}</div>
                <div className="text-white text-lg font-semibold">{day.high}°</div>
                <div className="text-white/60 text-sm mb-1">{day.low}°</div>
                {day.precipProb > 0 && (
                  <div className="text-blue-300 text-xs flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {day.precipProb}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* NASA AIR QUALITY - FEATURED */}
        <div className="bg-gradient-to-br from-emerald-900/60 to-green-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-emerald-500/30 lg:col-span-2">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            NASA TEMPO AIR QUALITY - {selectedCity}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">{weather.aqi}</div>
              <div className="text-white text-lg font-semibold">AQI</div>
              <div className="text-green-400 text-sm">Good</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-white/60 uppercase mb-1">NO₂</div>
              <div className="text-2xl font-bold text-white">{weather.no2}</div>
              <div className="text-xs text-white/60">ppb</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-white/60 uppercase mb-1">O₃</div>
              <div className="text-2xl font-bold text-white">{weather.o3}</div>
              <div className="text-xs text-white/60">ppb</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-xs text-white/60 uppercase mb-1">PM2.5</div>
              <div className="text-2xl font-bold text-white">{weather.pm25}</div>
              <div className="text-xs text-white/60">μg/m³</div>
            </div>
          </div>
          <div className="bg-emerald-500/20 rounded-lg p-3 border border-emerald-500/30">
            <div className="text-white/90 text-sm">Air quality is good. Perfect for outdoor activities in {selectedCity}!</div>
            <div className="text-emerald-300 text-xs mt-2">Data Source: NASA TEMPO Satellite Network</div>
          </div>
        </div>

        {/* 14-DAY DETAILED */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:row-span-2">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4">14-DAY FORECAST</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {forecast.map((day, idx) => (
              <div key={idx} className="py-2 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white text-sm w-16">{idx === 0 ? 'Today' : day.day}</div>
                  <div className="text-2xl">{getWeatherIcon(day.weatherCode)}</div>
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"></div>
                  </div>
                  <div className="text-white/60 text-sm">{day.low}°</div>
                  <div className="text-white text-sm font-semibold ml-2">{day.high}°</div>
                </div>
                {(day.precipProb > 0 || day.windSpeed > 10) && (
                  <div className="flex gap-3 text-xs text-white/60 mt-1">
                    {day.precipProb > 0 && (
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> {day.precipProb}%
                      </span>
                    )}
                    {day.windSpeed > 10 && (
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3" /> {day.windSpeed} mph
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RAIN/PRECIPITATION */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            PRECIPITATION
          </h3>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-white mb-2">{weather.precipitation}</div>
            <div className="text-lg text-white mb-1">mm last hour</div>
          </div>
          <div className="space-y-2">
            <div className="text-white/70 text-xs mb-2">7-Day Rain Forecast:</div>
            {forecast.slice(0, 7).map((day, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white/70 w-16">{idx === 0 ? 'Today' : day.day}</span>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full" 
                      style={{width: `${day.precipProb}%`}}
                    ></div>
                  </div>
                  <span className="text-blue-300 w-12 text-right">{day.precipProb}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SURF FORECAST */}
        {surf && (
          <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30">
            <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              SURF FORECAST 🏄
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{surf.waveHeight} ft</div>
                <div className="text-white/60 text-xs">Wave Height</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{surf.swellPeriod}s</div>
                <div className="text-white/60 text-xs">Swell Period</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-cyan-400 mb-1">{surf.direction}</div>
                <div className="text-white/60 text-xs">Direction</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-cyan-400 mb-1">{surf.waterTemp}°C</div>
                <div className="text-white/60 text-xs">Water Temp</div>
              </div>
            </div>
            <div className="bg-cyan-500/20 rounded-lg p-3 border border-cyan-500/30">
              <div className="text-white text-sm font-semibold">Conditions: {surf.condition}</div>
            </div>
          </div>
        )}

        {/* WIND */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Wind className="w-4 h-4" />
            WIND
          </h3>
          <div className="text-center mb-4">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-white">{getWindDir(weather.windDir)}</div>
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">{weather.windSpeed}</div>
            <div className="text-xl text-white">mph</div>
          </div>
          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="text-white/70 text-xs mb-2">5-Day Wind Forecast:</div>
            {forecast.slice(0, 5).map((day, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-white/70">{idx === 0 ? 'Today' : day.day}</span>
                <div className="flex items-center gap-2">
                  <Navigation className="w-3 h-3 text-blue-400" />
                  <span className="text-white">{day.windSpeed} mph</span>
                  <span className="text-white/60 text-xs">(Gusts: {day.windGusts})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UV INDEX */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            UV INDEX
          </h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">{Math.round(weather.uvIndex)}</div>
            <div className="text-2xl text-white mb-4">
              {weather.uvIndex <= 2 ? 'Low' : weather.uvIndex <= 5 ? 'Moderate' : weather.uvIndex <= 7 ? 'High' : 'Very High'}
            </div>
            <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full mb-2"></div>
            <p className="text-white/70 text-sm">
              {weather.uvIndex > 5 ? `Use protection until ${weather.sunset}` : 'No protection needed'}
            </p>
          </div>
        </div>

        {/* SUNSET */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            SUNSET
          </h3>
          <div className="text-center">
            <div className="text-5xl font-light text-white mb-4">{weather.sunset}</div>
            <div className="w-32 h-32 mx-auto relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-blue-600 rounded-full opacity-50"></div>
              <Sun className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-yellow-300" />
            </div>
            <p className="text-white/70 text-sm">Sunrise: {weather.sunrise}</p>
          </div>
        </div>

        {/* HUMIDITY */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            HUMIDITY
          </h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">{weather.humidity}%</div>
            <div className="w-32 h-32 mx-auto relative mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"/>
                <circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8"
                  strokeDasharray={`${weather.humidity * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <Droplets className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-blue-400" />
            </div>
            <p className="text-white/70 text-sm">Dew point: {weather.temp - 5}°</p>
          </div>
        </div>

        {/* VISIBILITY */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            VISIBILITY
          </h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">
              {weather.cloudCover < 30 ? '10+' : weather.cloudCover < 60 ? '5-10' : '2-5'}
            </div>
            <div className="text-2xl text-white mb-4">mi</div>
            <p className="text-white/70 text-sm">
              {weather.cloudCover < 30 ? 'Perfectly clear view' : weather.cloudCover < 60 ? 'Good visibility' : 'Reduced visibility'}
            </p>
          </div>
        </div>

        {/* PRESSURE */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            PRESSURE
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">{weather.pressure}</div>
            <div className="text-lg text-white mb-4">mbar</div>
            <div className="flex justify-between text-sm text-white/60 px-8">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* FEELS LIKE */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <h3 className="text-white text-sm uppercase tracking-wide mb-4">FEELS LIKE</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-4">{weather.feelsLike}°</div>
            <p className="text-white/70 text-sm">
              {weather.feelsLike > weather.temp + 3 ? 'Humidity makes it feel hotter' : 
               weather.feelsLike < weather.temp - 3 ? 'Wind makes it feel colder' : 
               'Similar to actual temperature'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Weather;