// SearchSection.tsx
import React from 'react';
import type { CityData } from './types';
import { getWeatherIcon, getMatchTypeDescription, findCityByName } from './utils';
import { POPULAR_CITIES } from './constants';

interface SearchSectionProps {
  searchCity: string;
  onSearchCityChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onGetCurrentLocation: () => void;
  onToggleCalendar: () => void;
  onSuggestionClick: (cityName: string) => void;
  searchSuggestions: CityData[];
  showSuggestions: boolean;
  onShowSuggestions: (show: boolean) => void;
  searchHistory: string[];
  loading: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchCity,
  onSearchCityChange,
  onKeyPress,
  onSearch,
  onGetCurrentLocation,
  onToggleCalendar,
  onSuggestionClick,
  searchSuggestions,
  showSuggestions,
  onShowSuggestions,
  searchHistory,
  loading
}) => {
  const handleFocus = () => {
    if (searchCity.length > 0) {
      onShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => onShowSuggestions(false), 150);
  };

  return (
    <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
      <div className="flex gap-3 relative">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-70 text-xl">🔍</span>
          <input
            type="text"
            placeholder="都市名を入力（例: 東京、札幌、福岡）"
            className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            value={searchCity}
            onChange={(e) => onSearchCityChange(e.target.value)}
            onKeyPress={onKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-95 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
              {searchSuggestions.map((city, index) => (
                <div
                  key={index}
                  onClick={() => onSuggestionClick(city.name)}
                  className="px-4 py-3 hover:bg-blue-500 hover:bg-opacity-20 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{city.name}</span>
                          {city.region && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {city.region}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {getMatchTypeDescription(city.matchType || '')}
                          </span>
                          <span className="text-xs text-gray-600">
                            類似度: {Math.round((city.score || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">{Math.round(city.main.temp)}°C</span>
                      <div className="text-lg">{getWeatherIcon(city.weather[0].icon)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-6 py-3 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
          type="button"
        >
          検索
        </button>
        <button
          onClick={onGetCurrentLocation}
          disabled={loading}
          className="px-4 py-3 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white transition-colors disabled:opacity-50"
          type="button"
        >
          📍
        </button>
        <button
          onClick={onToggleCalendar}
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
                onClick={() => onSuggestionClick(city)}
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
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {POPULAR_CITIES.map((city) => {
            const cityData = findCityByName(city);
            return (
              <button
                key={city}
                onClick={() => onSuggestionClick(city)}
                className="px-3 py-2 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-lg text-white text-sm transition-colors flex items-center justify-between"
                type="button"
              >
                <span className="truncate">{city}</span>
                <span className="text-xs opacity-70 ml-1 shrink-0">
                  {cityData ? Math.round(cityData.main.temp) + '°' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;