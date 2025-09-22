import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  // State management
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['Tokyo', 'Osaka']);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    time: '', 
    title: '', 
    type: 'personal' 
  });
  const [events, setEvents] = useState({
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

  // Constants
  const EVENT_TYPES = {
    personal: { label: '個人', color: 'bg-blue-500', bgOpacity: 'bg-opacity-50', icon: '👤' },
    work: { label: '仕事', color: 'bg-red-500', bgOpacity: 'bg-opacity-50', icon: '💼' },
    company: { label: '会社', color: 'bg-orange-500', bgOpacity: 'bg-opacity-50', icon: '🏢' },
    social: { label: '社交', color: 'bg-green-500', bgOpacity: 'bg-opacity-50', icon: '🎉' },
    workout: { label: '運動', color: 'bg-purple-500', bgOpacity: 'bg-opacity-50', icon: '💪' }
  };

  const SAMPLE_WEATHER_DATA = {
    name: "Tokyo",
    main: {
      temp: 22,
      feels_like: 25,
      humidity: 65,
      pressure: 1013
    },
    weather: [{
      main: "Clear",
      description: "晴れ",
      icon: "01d"
    }],
    wind: {
      speed: 3.5
    },
    sys: {
      country: "JP"
    }
  };

  const CITIES_DATA = {
    'tokyo': { 
      ...SAMPLE_WEATHER_DATA, 
      name: 'Tokyo', 
      country: 'Japan',
      main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 }
    },
    'osaka': { 
      ...SAMPLE_WEATHER_DATA, 
      name: 'Osaka', 
      country: 'Japan',
      main: { ...SAMPLE_WEATHER_DATA.main, temp: 25 },
      weather: [{ main: "Clouds", description: "曇り", icon: "02d" }]
    },
    'kyoto': { 
      ...SAMPLE_WEATHER_DATA, 
      name: 'Kyoto', 
      country: 'Japan',
      main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 },
      weather: [{ main: "Rain", description: "小雨", icon: "10d" }]
    },
    'new york': { 
      ...SAMPLE_WEATHER_DATA, 
      name: 'New York', 
      country: 'USA',
      main: { ...SAMPLE_WEATHER_DATA.main, temp: 18 },
      weather: [{ main: "Clouds", description: "曇り", icon: "04d" }]
    },
    'london': { 
      ...SAMPLE_WEATHER_DATA, 
      name: 'London', 
      country: 'UK',
      main: { ...SAMPLE_WEATHER_DATA.main, temp: 15 },
      weather: [{ main: "Rain", description: "雨", icon: "09d" }]
    }
  };

  const FORECAST_DATA = {
    list: [
      { dt: Date.now() / 1000 + 3600, main: { temp: 24 }, weather: [{ main: "晴れ", icon: "01d" }] },
      { dt: Date.now() / 1000 + 7200, main: { temp: 26 }, weather: [{ main: "曇り", icon: "02d" }] },
      { dt: Date.now() / 1000 + 10800, main: { temp: 23 }, weather: [{ main: "雨", icon: "09d" }] },
      { dt: Date.now() / 1000 + 14400, main: { temp: 20 }, weather: [{ main: "晴れ", icon: "01n" }] }
    ]
  };

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  // Utility functions
  const getWeatherIcon = (iconCode) => {
    const icons = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return icons[iconCode] || '🌤️';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeatherForDate = (date) => {
    const weathers = ['☀️', '⛅', '🌧️', '☁️', '🌤️'];
    const temps = [18, 22, 25, 28, 20, 15, 30];
    const hash = date.getDate() + date.getMonth();
    return {
      icon: weathers[hash % weathers.length],
      temp: temps[hash % temps.length]
    };
  };

  // Event handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);
    
    if (value.trim().length > 0) {
      const suggestions = Object.keys(CITIES_DATA)
        .filter(city => city.includes(value.toLowerCase()))
        .slice(0, 5)
        .map(key => CITIES_DATA[key]);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setSearchCity(cityName);
    setShowSuggestions(false);
    searchWeatherByName(cityName);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      searchWeather();
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(calendarDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const handleEventChange = (field, value) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Main functions
  const searchWeatherByName = (cityName) => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const cityKey = cityName.toLowerCase();
      const cityData = CITIES_DATA[cityKey];
      
      if (cityData) {
        setWeatherData(cityData);
        setForecastData(FORECAST_DATA);
        
        const newHistory = searchHistory.filter(item => item !== cityName);
        setSearchHistory([cityName, ...newHistory].slice(0, 5));
        setError('');
      } else {
        setError('都市が見つかりませんでした。対応都市: Tokyo, Osaka, Kyoto, New York, London');
        setWeatherData(null);
        setForecastData(null);
      }
      
      setLoading(false);
    }, 800);
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
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setWeatherData(SAMPLE_WEATHER_DATA);
            setForecastData(FORECAST_DATA);
            setSearchCity('Tokyo');
            setLoading(false);
          }, 800);
        },
        () => {
          setError('位置情報の取得に失敗しました。');
          setLoading(false);
        }
      );
    } else {
      setError('位置情報がサポートされていません。');
      setLoading(false);
    }
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
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">天気予報アプリ</h1>
          <p className="text-blue-100">世界各地の天気情報をお届け</p>
          
          <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-4 inline-block">
            <div className="flex items-center justify-center gap-3 text-white">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-lg font-semibold">{formatDate(currentDateTime)}</p>
                <p className="text-sm text-blue-100">{formatTime(currentDateTime)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
          <div className="flex gap-3 relative">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-70 text-xl">🔍</span>
              <input
                type="text"
                placeholder="都市名を入力してください（例: Tokyo, Osaka, London）"
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={searchCity}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => searchCity.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-95 rounded-xl shadow-lg z-10">
                  {searchSuggestions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(city.name)}
                      className="px-4 py-3 hover:bg-blue-500 hover:bg-opacity-20 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{city.name}, {city.country}</span>
                        <span className="text-sm text-gray-600">{Math.round(city.main.temp)}°C</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={searchWeather}
              disabled={loading}
              className="px-6 py-3 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
              type="button"
            >
              検索
            </button>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-4 py-3 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white transition-colors disabled:opacity-50"
              type="button"
            >
              📍
            </button>
            <button
              onClick={handleCalendarToggle}
              className="px-4 py-3 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white transition-colors"
              type="button"
            >
              📅
            </button>
          </div>
          
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-white text-opacity-70 text-sm mb-2">最近の検索:</p>
              <div className="flex gap-2 flex-wrap">
                {searchHistory.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(city)}
                    className="px-3 py-1 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-lg text-white text-sm transition-colors"
                    type="button"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Popular Cities */}
          <div className="mt-4">
            <p className="text-white text-opacity-70 text-sm mb-2">人気の都市:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Tokyo', 'Osaka', 'New York', 'London', 'Kyoto'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleSuggestionClick(city)}
                  className="px-3 py-2 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-lg text-white text-sm transition-colors flex items-center justify-between"
                  type="button"
                >
                  <span>{city}</span>
                  <span className="text-xs opacity-70">
                    {CITIES_DATA[city.toLowerCase()] ? Math.round(CITIES_DATA[city.toLowerCase()].main.temp) + '°' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Calendar */}
        {showCalendar && (
          <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">カレンダー</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-lg text-white transition-colors text-xl"
                  type="button"
                >
                  ◀
                </button>
                <span className="text-white font-semibold text-lg min-w-[120px] text-center">
                  {calendarDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                </span>
                <button 
                  onClick={() => handleMonthChange(1)}
                  className="p-2 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-lg text-white transition-colors text-xl"
                  type="button"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-white text-opacity-80 font-semibold p-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: getFirstDayOfMonth(calendarDate) }, (_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              
              {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => {
                const day = i + 1;
                const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                const dateKey = formatDateKey(date);
                const dayEvents = events[dateKey] || [];
                const weather = getWeatherForDate(date);
                const isToday = date.toDateString() === currentDateTime.toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={day}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 min-h-[80px] rounded-lg cursor-pointer transition-colors relative
                      ${isToday ? 'bg-blue-500 bg-opacity-60 border-2 border-blue-300' : 'bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20'}
                      ${isSelected ? 'ring-2 ring-white ring-opacity-60' : ''}`}
                  >
                    <div className="text-white font-semibold">{day}</div>
                    <div className="text-xs flex items-center justify-between mt-1">
                      <span>{weather.icon}</span>
                      <span className="text-white text-opacity-80">{weather.temp}°</span>
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="mt-1">
                        {dayEvents.slice(0, 2).map((event, idx) => (
                          <div 
                            key={idx} 
                            className={`text-xs p-1 rounded mb-1 truncate flex items-center gap-1 ${EVENT_TYPES[event.type]?.color || 'bg-gray-500'} ${EVENT_TYPES[event.type]?.bgOpacity || 'bg-opacity-50'}`}
                          >
                            <span>{EVENT_TYPES[event.type]?.icon || '📝'}</span>
                            <span className="text-white">{event.time} {event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-white text-opacity-60">+{dayEvents.length - 2}件</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-white bg-opacity-20 rounded-xl p-4 mt-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  {selectedDate.toLocaleDateString('ja-JP', { 
                    month: 'long', 
                    day: 'numeric', 
                    weekday: 'long' 
                  })} の予定
                </h4>
                
                <div className="mb-4">
                  {(events[formatDateKey(selectedDate)] || []).map((event, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-2 text-white">
                      <span className="text-sm bg-white bg-opacity-30 px-2 py-1 rounded">{event.time}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <span>{EVENT_TYPES[event.type]?.icon || '📝'}</span>
                        <span>{event.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded text-white ${EVENT_TYPES[event.type]?.color || 'bg-gray-500'} ${EVENT_TYPES[event.type]?.bgOpacity || 'bg-opacity-50'}`}>
                        {EVENT_TYPES[event.type]?.label || '不明'}
                      </span>
                    </div>
                  ))}
                  {(events[formatDateKey(selectedDate)] || []).length === 0 && (
                    <p className="text-white text-opacity-60 text-sm">この日の予定はありません</p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => handleEventChange('time', e.target.value)}
                    className="px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white text-sm"
                    style={{colorScheme: 'dark'}}
                  />
                  <input
                    type="text"
                    placeholder="予定を入力"
                    value={newEvent.title}
                    onChange={(e) => handleEventChange('title', e.target.value)}
                    className="flex-1 min-w-[150px] px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white placeholder-white placeholder-opacity-70 text-sm"
                  />
                  <select
                    value={newEvent.type}
                    onChange={(e) => handleEventChange('type', e.target.value)}
                    className="px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white text-sm"
                    style={{colorScheme: 'dark'}}
                  >
                    {Object.entries(EVENT_TYPES).map(([key, type]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addEvent}
                    className="px-4 py-2 bg-blue-500 bg-opacity-60 hover:bg-blue-500 hover:bg-opacity-80 rounded text-white text-sm transition-colors flex items-center gap-1"
                    type="button"
                  >
                    <span className="text-sm">➕</span>
                    追加
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-30 border border-red-300 border-opacity-50 rounded-2xl p-4 mb-6 text-white text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white border-opacity-30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white">天気データを取得中...</p>
          </div>
        )}

        {/* Current Weather */}
        {weatherData && !loading && (
          <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  {weatherData.name}, {weatherData.sys.country}
                </h2>
                <p className="text-blue-100">{weatherData.weather[0].description}</p>
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
                <p className="text-white font-bold text-lg">{weatherData.wind.speed} m/s</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <span className="text-3xl">⏲️</span>
                <p className="text-white text-opacity-80 text-sm">気圧</p>
                <p className="text-white font-bold text-lg">{weatherData.main.pressure} hPa</p>
              </div>
            </div>
          </section>
        )}

        {/* 4-hour Forecast */}
        {forecastData && !loading && (
          <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">4時間予報</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {forecastData.list.slice(0, 4).map((item, index) => {
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
                    <p className="text-white text-opacity-70 text-sm">{item.weather[0].main}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-white text-opacity-70">
          <p>Built with React & Weather API</p>
          <p className="text-sm mt-2">
            対応都市: Tokyo, Osaka, Kyoto, New York, London
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherApp;