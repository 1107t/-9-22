// utils.ts
import type { CityData } from './types';
import { CITIES_DATA } from './constants';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const getWeatherForDate = (date: Date) => {
  const weathers = ['☀️', '⛅', '🌧️', '☁️', '🌤️'];
  const temps = [18, 22, 25, 28, 20, 15, 30];
  const hash = date.getDate() + date.getMonth();
  return {
    icon: weathers[hash % weathers.length],
    temp: temps[hash % temps.length]
  };
};

export const getWeatherIcon = (iconCode: string): string => {
  const icons: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return icons[iconCode] || '🌤️';
};

export const calculateLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const calculateSimilarity = (input: string, target: string): number => {
  const distance = calculateLevenshteinDistance(input.toLowerCase(), target.toLowerCase());
  const maxLength = Math.max(input.length, target.length);
  return maxLength === 0 ? 1 : 1 - (distance / maxLength);
};

export const fuzzySearch = (query: string, threshold = 0.3): CityData[] => {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  const results: CityData[] = [];

  Object.entries(CITIES_DATA).forEach(([key, city]) => {
    let bestScore = 0;
    let matchType = '';

    if (city.name.toLowerCase() === queryLower) {
      bestScore = 1;
      matchType = 'exact';
    } else if (city.aliases.some(alias => alias.toLowerCase() === queryLower)) {
      bestScore = 1;
      matchType = 'exact_alias';
    } else if (city.name.toLowerCase().includes(queryLower)) {
      bestScore = 0.9;
      matchType = 'partial';
    } else if (city.aliases.some(alias => alias.toLowerCase().includes(queryLower))) {
      bestScore = 0.9;
      matchType = 'partial_alias';
    } else {
      const nameSimilarity = calculateSimilarity(queryLower, city.name);
      const aliasSimilarities = city.aliases.map(alias => 
        calculateSimilarity(queryLower, alias)
      );
      const maxAliasSimilarity = Math.max(...aliasSimilarities);
      
      bestScore = Math.max(nameSimilarity, maxAliasSimilarity);
      matchType = nameSimilarity >= maxAliasSimilarity ? 'fuzzy_name' : 'fuzzy_alias';
    }

    if (bestScore >= threshold) {
      results.push({
        ...city,
        score: bestScore,
        matchType: matchType
      });
    }
  });

  return results.sort((a, b) => b.score! - a.score!).slice(0, 8);
};

export const getMatchTypeDescription = (matchType: string): string => {
  switch (matchType) {
    case 'exact':
    case 'exact_alias':
      return '完全一致';
    case 'partial':
    case 'partial_alias':
      return '部分一致';
    case 'fuzzy_name':
    case 'fuzzy_alias':
      return 'あいまい検索';
    default:
      return '';
  }
};

export const findCityByName = (cityName: string): CityData | null => {
  const results = fuzzySearch(cityName, 0.3);
  return results.length > 0 ? results[0] : null;
};