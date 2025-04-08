import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Droplet } from 'lucide-react';
import './weather.scss';

const WeatherApp = () => {
  const [weather, setWeather] = useState({ temp: 0, condition: '', location: 'Loading...', humidity: 0, windSpeed: 0, icon: '' });
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'ea66fb5faaf46f9ca31715f5cf8e69ef';
  const DEFAULT_CITY = 'San Francisco';

  const fetchWeatherData = async (city = DEFAULT_CITY) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=17.2752&lon=74.5357&appid=2582dc85d79e5a1c87098e24a85aeb02`
      );
      const data = response.data;
      setWeather({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main.toLowerCase(),
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        icon: data.weather[0].icon,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    const weatherTimer = setInterval(() => fetchWeatherData(), 5 * 60 * 1000);
    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const getWeatherIcon = () => {
    if (weather.icon) {
      const iconCode = weather.icon;
      if (iconCode.includes('01')) return <Sun size={45} className="weather-icon sunny" />;
      if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud size={45} className="weather-icon cloudy" />;
      if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain size={45} className="weather-icon rainy" />;
      if (iconCode.includes('11')) return <CloudLightning size={45} className="weather-icon stormy" />;
      if (iconCode.includes('13')) return <CloudSnow size={45} className="weather-icon snowy" />;
      if (iconCode.includes('50')) return <Wind size={45} className="weather-icon windy" />;
    }
    return <Sun size={48} className="weather-icon sunny" />;
  };

  return (
    <div className={`weather-container compact ${loading ? 'day-bg' : 'day-bg'}`}>
         <div className="player-header">
        <h4 className="header-title">Today's Weather<span className="header-span"></span></h4>
      </div>
      <div className="weather-grid-horizontal">
        <div className="weather-column">
          <p>{dateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          <p>{dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
        <div className="weather-column">
          <p className="weather-location">{weather.location}</p>
          <div className="weather-icon">{getWeatherIcon()}</div>
        </div>
        <div className="weather-column">
          <p>{weather.temp}°F</p>
          <p><Droplet size={14} /> {weather.humidity}%</p>
          <p><Wind size={14} /> {weather.windSpeed} mph</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
