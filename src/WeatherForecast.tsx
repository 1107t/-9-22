// WeatherForecast.tsx
import React from 'react';
import type { ForecastData, ApiMode, ForecastItem } from './types';
import { getWeatherIcon } from './utils';

interface WeatherForecastProps {
  forecastData: ForecastData;
  apiMode: ApiMode;
  currentDateTime: Date;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  forecastData, 
  apiMode, 
  currentDateTime 
}) => {
  return (
    <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">
          {apiMode === 'live' ? '今後の天気予報' : '4時間予報'}
        </h3>
        {apiMode === 'live' && (
          <span className="px-2 py-1 bg-green-500 bg-opacity-60 rounded text-white text-xs">
            LIVE DATA
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {forecastData.list.slice(0, 4).map((item: ForecastItem, index: number) => {
          const forecastDate = new Date(item.dt * 1000);
          const isToday = forecastDate.toDateString() === currentDateTime.toDateString();
          const isTomorrow = forecastDate.toDateString() === new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000).toDateString();
          
          let dateLabel;
          if (isToday) {
            dateLabel = '今日';
          } else if (isTomorrow) {
            dateLabel = '明日';
          } else {
            dateLabel = forecastDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
          }
          
          return (
            <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <p className="text-white text-opacity-80 text-sm mb-1">{dateLabel}</p>
              <p className="text-white text-opacity-80 text-sm mb-2">
                {forecastDate.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <div className="text-3xl mb-2">{getWeatherIcon(item.weather[0].icon)}</div>
              <p className="text-white font-bold">{Math.round(item.main.temp)}°C</p>
              <p className="text-white text-opacity-70 text-sm">
                {item.weather[0].description || item.weather[0].main}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeatherForecast;