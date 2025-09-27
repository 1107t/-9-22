// apiService.ts
import type { WeatherData, ForecastData } from './types';

export const fetchWeatherFromAPI = async (
  apiKey: string,
  cityName: string | null, 
  lat: number | null = null, 
  lon: number | null = null
) => {
  if (!apiKey.trim()) {
    throw new Error('APIキーが設定されていません');
  }

  const baseUrl = 'https://api.openweathermap.org/data/2.5';
  let weatherUrl, forecastUrl;

  if (lat && lon) {
    weatherUrl = `${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    forecastUrl = `${baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
  } else {
    weatherUrl = `${baseUrl}/weather?q=${encodeURIComponent(cityName!)}&appid=${apiKey}&units=metric&lang=ja`;
    forecastUrl = `${baseUrl}/forecast?q=${encodeURIComponent(cityName!)}&appid=${apiKey}&units=metric&lang=ja`;
  }

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 401) {
        throw new Error('APIキーが無効です');
      } else if (weatherResponse.status === 404) {
        throw new Error('都市が見つかりませんでした');
      } else {
        throw new Error(`API エラー: ${weatherResponse.status}`);
      }
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    return {
      weather: weatherData,
      forecast: {
        list: forecastData.list.slice(0, 8)
      }
    };
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};