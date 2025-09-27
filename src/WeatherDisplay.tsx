// WeatherDisplay.tsx
import React from 'react';
import type { WeatherData, ApiMode } from './types';
import { getWeatherIcon } from './utils';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  apiMode: ApiMode;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, apiMode }) => {
  return (
    <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-xl">📍</span>
              {weatherData.name}
              {weatherData.sys?.country && `, ${weatherData.sys.country}`}
            </h2>
            {apiMode === 'live' && (
              <span className="px-2 py-1 bg-green-500 bg-opacity-60 rounded text-white text-xs">
                LIVE
              </span>
            )}
          </div>
          <p className="text-blue-100">{weatherData.weather[0].description}</p>
          {apiMode === 'live' && weatherData.dt && (
            <p className="text-blue-200 text-sm mt-1">
              最終更新: {new Date(weatherData.dt * 1000).toLocaleString('ja-JP')}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-6xl mb-2">{getWeatherIcon(weatherData.weather[0].icon)}</div>
          <div className="text-4xl font-bold text-white">{Math.round(weatherData.main.temp)}°C</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <span className="text-3xl">🌡️</span>
          <p className="text-white text-opacity-80 text-sm">体感温度</p>
          <p className="text-white font-bold text-lg">{Math.round(weatherData.main.feels_like)}°C</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <span className="text-3xl">💧</span>
          <p className="text-white text-opacity-80 text-sm">湿度</p>
          <p className="text-white font-bold text-lg">{weatherData.main.humidity}%</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <span className="text-3xl">💨</span>
          <p className="text-white text-opacity-80 text-sm">風速</p>
          <p className="text-white font-bold text-lg">{weatherData.wind?.speed || 0} m/s</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <span className="text-3xl">⏲️</span>
          <p className="text-white text-opacity-80 text-sm">気圧</p>
          <p className="text-white font-bold text-lg">{weatherData.main.pressure} hPa</p>
        </div>
      </div>
    </section>
  );
};

export default WeatherDisplay;