// WeatherApp.tsx
import React, { useState, useEffect } from 'react';
import type { WeatherData, ForecastData, CityData, Event, Events, ApiMode } from './types';
import { SAMPLE_WEATHER_DATA, FORECAST_DATA } from './constants';
import { fuzzySearch, findCityByName, formatDateKey } from './utils';
import Header from './Header';
import ApiKeyInput from './ApiKeyInput';
import SearchSection from './SearchSection';
import WeatherDisplay from './WeatherDisplay';
import WeatherForecast from './WeatherForecast';
import Calendar from './Calendar';

const WeatherApp = () => {
  // State management
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['Tokyo', 'Osaka']);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [apiMode, setApiMode] = useState<ApiMode>('demo');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({ 
    time: '', 
    title: '', 
    type: 'personal' 
  });
  const [events, setEvents] = useState<Events>({
    '2025-09-22': [
      { time: '10:00', title: '会議', type: 'work' },
      { time: '18:00', title: 'ジム', type: 'workout' }
    ],
    '2025-09-25': [
      { time: '14:00', title: '歯医者', type: 'personal' },
      { time: '19:00', title: 'チームディナー', type: 'company' }
    ],
    '2025-09-28': [
      { time: '19:00', title: '飲み会', type: 'social' },
      { time: '07:00', title: 'ランニング', type: 'workout' }
    ]
  });

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchCity(value);
    
    if (value.trim().length > 0) {
      const suggestions = fuzzySearch(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (cityName: string) => {
    setSearchCity(cityName);
    setShowSuggestions(false);
    searchWeatherByName(cityName);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      searchWeather();
    }
  };

  const searchWeatherByName = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const cityData = findCityByName(cityName);
      
      if (cityData) {
        setWeatherData(cityData);
        setForecastData(FORECAST_DATA);
        
        const newHistory = searchHistory.filter(item => item !== cityData.name);
        setSearchHistory([cityData.name, ...newHistory].slice(0, 5));
      } else {
        throw new Error('都市が見つかりませんでした。別の都市名や表記で試してみてください。');
      }
      setError('');
    } catch (error) {
      console.error('天気データ取得エラー:', error);
      setError((error as Error).message || '天気データの取得に失敗しました。');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const searchWeather = () => {
    if (!searchCity.trim()) {
      setError('都市名を入力してください');
      return;
    }
    searchWeatherByName(searchCity.trim());
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setWeatherData(SAMPLE_WEATHER_DATA);
      setForecastData(FORECAST_DATA);
      setSearchCity('Tokyo');
      setLoading(false);
    }, 800);
  };

  const toggleApiMode = () => {
    if (apiMode === 'demo') {
      setShowApiKeyInput(true);
    } else {
      setApiMode('demo');
      setShowApiKeyInput(false);
      setApiKey('');
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setApiMode('live');
      setShowApiKeyInput(false);
      setError('');
    } else {
      setError('有効なAPIキーを入力してください');
    }
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(calendarDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const handleEventChange = (field: keyof Event, value: string) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEvent = () => {
    if (!selectedDate || !newEvent.time || !newEvent.title) return;
    
    const dateKey = formatDateKey(selectedDate);
    const updatedEvents = { ...events };
    if (!updatedEvents[dateKey]) {
      updatedEvents[dateKey] = [];
    }
    updatedEvents[dateKey].push({ ...newEvent });
    setEvents(updatedEvents);
    
    setNewEvent({ time: '', title: '', type: 'personal' });
  };

  // Effects
  useEffect(() => {
    setWeatherData(SAMPLE_WEATHER_DATA);
    setForecastData(FORECAST_DATA);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <Header 
          currentDateTime={currentDateTime}
          apiMode={apiMode}
          onToggleApiMode={toggleApiMode}
        />

        {showApiKeyInput && (
          <ApiKeyInput
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onSubmit={handleApiKeySubmit}
            onCancel={() => setShowApiKeyInput(false)}
          />
        )}

        <SearchSection
          searchCity={searchCity}
          onSearchCityChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          onSearch={searchWeather}
          onGetCurrentLocation={getCurrentLocation}
          onToggleCalendar={handleCalendarToggle}
          onSuggestionClick={handleSuggestionClick}
          searchSuggestions={searchSuggestions}
          showSuggestions={showSuggestions}
          onShowSuggestions={setShowSuggestions}
          searchHistory={searchHistory}
          loading={loading}
        />

        {showCalendar && (
          <Calendar
            calendarDate={calendarDate}
            selectedDate={selectedDate}
            currentDateTime={currentDateTime}
            events={events}
            newEvent={newEvent}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            onEventChange={handleEventChange}
            onAddEvent={addEvent}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-30 border border-red-300 border-opacity-50 rounded-2xl p-4 mb-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">エラー</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white border-opacity-30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white">天気データを取得中...</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !loading && (
          <WeatherDisplay 
            weatherData={weatherData} 
            apiMode={apiMode} 
          />
        )}

        {/* Forecast */}
        {forecastData && !loading && (
          <WeatherForecast 
            forecastData={forecastData} 
            apiMode={apiMode}
            currentDateTime={currentDateTime}
          />
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-white text-opacity-70">
          <p>Built with React & OpenWeatherMap API</p>
          <p className="text-sm mt-2">日本全国対応 + 世界中の都市検索</p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherApp;