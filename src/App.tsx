import React, { useState, useEffect } from 'react';

// Type definitions
interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

interface WeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}

interface WeatherWind {
  speed: number;
}

interface WeatherSys {
  country: string;
}

interface WeatherData {
  name: string;
  main: WeatherMain;
  weather: WeatherCondition[];
  wind: WeatherWind;
  sys: WeatherSys;
  dt?: number;
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: WeatherCondition[];
}

interface ForecastData {
  list: ForecastItem[];
}

interface CityData extends WeatherData {
  country: string;
  region: string;
  aliases: string[];
  score?: number;
  matchType?: string;
}

interface Event {
  time: string;
  title: string;
  type: string;
}

interface EventType {
  label: string;
  color: string;
  bgOpacity: string;
  icon: string;
}

interface Events {
  [key: string]: Event[];
}

interface EventTypes {
  personal: EventType;
  work: EventType;
  company: EventType;
  social: EventType;
  workout: EventType;
}

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
  const [apiMode, setApiMode] = useState('demo');
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

  // Constants
  const EVENT_TYPES: EventTypes = {
    personal: { label: '個人', color: 'bg-blue-500', bgOpacity: 'bg-opacity-50', icon: '👤' },
    work: { label: '仕事', color: 'bg-red-500', bgOpacity: 'bg-opacity-50', icon: '💼' },
    company: { label: '会社', color: 'bg-orange-500', bgOpacity: 'bg-opacity-50', icon: '🏢' },
    social: { label: '社交', color: 'bg-green-500', bgOpacity: 'bg-opacity-50', icon: '🎉' },
    workout: { label: '運動', color: 'bg-purple-500', bgOpacity: 'bg-opacity-50', icon: '💪' }
  };

  const SAMPLE_WEATHER_DATA: WeatherData = {
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

  const CITIES_DATA: { [key: string]: CityData } = {
    // 北海道
    'sapporo': {
      ...SAMPLE_WEATHER_DATA, name: 'Sapporo', country: 'Japan', region: '北海道',
      aliases: ['札幌', 'さっぽろ', 'sapporo'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 8 },
      weather: [{ main: "Snow", description: "雪", icon: "13d" }]
    },
    'hakodate': { ...SAMPLE_WEATHER_DATA, name: 'Hakodate', country: 'Japan', region: '北海道', aliases: ['函館', 'はこだて', 'hakodate'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 5 } },
    'asahikawa': { ...SAMPLE_WEATHER_DATA, name: 'Asahikawa', country: 'Japan', region: '北海道', aliases: ['旭川', 'あさひかわ', 'asahikawa'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 3 } },
    'kushiro': { ...SAMPLE_WEATHER_DATA, name: 'Kushiro', country: 'Japan', region: '北海道', aliases: ['釧路', 'くしろ', 'kushiro'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 6 } },
    'obihiro': { ...SAMPLE_WEATHER_DATA, name: 'Obihiro', country: 'Japan', region: '北海道', aliases: ['帯広', 'おびひろ', 'obihiro'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 4 } },
    
    // 東北
    'sendai': { ...SAMPLE_WEATHER_DATA, name: 'Sendai', country: 'Japan', region: '東北', aliases: ['仙台', 'せんだい', 'sendai'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 16 } },
    'aomori': { ...SAMPLE_WEATHER_DATA, name: 'Aomori', country: 'Japan', region: '東北', aliases: ['青森', 'あおもり', 'aomori'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 12 } },
    'morioka': { ...SAMPLE_WEATHER_DATA, name: 'Morioka', country: 'Japan', region: '東北', aliases: ['盛岡', 'もりおか', 'morioka'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 14 } },
    'akita': { ...SAMPLE_WEATHER_DATA, name: 'Akita', country: 'Japan', region: '東北', aliases: ['秋田', 'あきた', 'akita'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 15 } },
    'yamagata': { ...SAMPLE_WEATHER_DATA, name: 'Yamagata', country: 'Japan', region: '東北', aliases: ['山形', 'やまがた', 'yamagata'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 17 } },
    'fukushima': { ...SAMPLE_WEATHER_DATA, name: 'Fukushima', country: 'Japan', region: '東北', aliases: ['福島', 'ふくしま', 'fukushima'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 18 } },
    
    // 関東
    'tokyo': {
      ...SAMPLE_WEATHER_DATA, name: 'Tokyo', country: 'Japan', region: '関東',
      aliases: ['東京', 'とうきょう', 'tokyo'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 }
    },
    'yokohama': { ...SAMPLE_WEATHER_DATA, name: 'Yokohama', country: 'Japan', region: '関東', aliases: ['横浜', 'よこはま', 'yokohama'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'chiba': { ...SAMPLE_WEATHER_DATA, name: 'Chiba', country: 'Japan', region: '関東', aliases: ['千葉', 'ちば', 'chiba'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 20 } },
    'saitama': { ...SAMPLE_WEATHER_DATA, name: 'Saitama', country: 'Japan', region: '関東', aliases: ['さいたま', 'saitama'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'urawa': { ...SAMPLE_WEATHER_DATA, name: 'Urawa', country: 'Japan', region: '関東', aliases: ['浦和', 'うらわ', 'urawa'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'mito': { ...SAMPLE_WEATHER_DATA, name: 'Mito', country: 'Japan', region: '関東', aliases: ['水戸', 'みと', 'mito'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 19 } },
    'utsunomiya': { ...SAMPLE_WEATHER_DATA, name: 'Utsunomiya', country: 'Japan', region: '関東', aliases: ['宇都宮', 'うつのみや', 'utsunomiya'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 20 } },
    'maebashi': { ...SAMPLE_WEATHER_DATA, name: 'Maebashi', country: 'Japan', region: '関東', aliases: ['前橋', 'まえばし', 'maebashi'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    
    // 中部
    'nagoya': { ...SAMPLE_WEATHER_DATA, name: 'Nagoya', country: 'Japan', region: '中部', aliases: ['名古屋', 'なごや', 'nagoya'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    'shizuoka': { ...SAMPLE_WEATHER_DATA, name: 'Shizuoka', country: 'Japan', region: '中部', aliases: ['静岡', 'しずおか', 'shizuoka'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'hamamatsu': { ...SAMPLE_WEATHER_DATA, name: 'Hamamatsu', country: 'Japan', region: '中部', aliases: ['浜松', 'はままつ', 'hamamatsu'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'niigata': { ...SAMPLE_WEATHER_DATA, name: 'Niigata', country: 'Japan', region: '中部', aliases: ['新潟', 'にいがた', 'niigata'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 18 } },
    'nagano': { ...SAMPLE_WEATHER_DATA, name: 'Nagano', country: 'Japan', region: '中部', aliases: ['長野', 'ながの', 'nagano'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 16 } },
    'matsumoto': { ...SAMPLE_WEATHER_DATA, name: 'Matsumoto', country: 'Japan', region: '中部', aliases: ['松本', 'まつもと', 'matsumoto'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 15 } },
    'kofu': { ...SAMPLE_WEATHER_DATA, name: 'Kofu', country: 'Japan', region: '中部', aliases: ['甲府', 'こうふ', 'kofu'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 20 } },
    'gifu': { ...SAMPLE_WEATHER_DATA, name: 'Gifu', country: 'Japan', region: '中部', aliases: ['岐阜', 'ぎふ', 'gifu'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'toyama': { ...SAMPLE_WEATHER_DATA, name: 'Toyama', country: 'Japan', region: '中部', aliases: ['富山', 'とやま', 'toyama'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 19 } },
    'kanazawa': { ...SAMPLE_WEATHER_DATA, name: 'Kanazawa', country: 'Japan', region: '中部', aliases: ['金沢', 'かなざわ', 'kanazawa'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 18 } },
    'fukui': { ...SAMPLE_WEATHER_DATA, name: 'Fukui', country: 'Japan', region: '中部', aliases: ['福井', 'ふくい', 'fukui'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 19 } },
    
    // 関西
    'osaka': {
      ...SAMPLE_WEATHER_DATA, name: 'Osaka', country: 'Japan', region: '関西',
      aliases: ['大阪', 'おおさか', 'osaka'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 25 },
      weather: [{ main: "Clouds", description: "曇り", icon: "02d" }]
    },
    'kyoto': {
      ...SAMPLE_WEATHER_DATA, name: 'Kyoto', country: 'Japan', region: '関西',
      aliases: ['京都', 'きょうと', 'kyoto'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 },
      weather: [{ main: "Rain", description: "小雨", icon: "10d" }]
    },
    'kobe': { ...SAMPLE_WEATHER_DATA, name: 'Kobe', country: 'Japan', region: '関西', aliases: ['神戸', 'こうべ', 'kobe'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    'nara': { ...SAMPLE_WEATHER_DATA, name: 'Nara', country: 'Japan', region: '関西', aliases: ['奈良', 'なら', 'nara'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'wakayama': { ...SAMPLE_WEATHER_DATA, name: 'Wakayama', country: 'Japan', region: '関西', aliases: ['和歌山', 'わかやま', 'wakayama'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 24 } },
    'otsu': { ...SAMPLE_WEATHER_DATA, name: 'Otsu', country: 'Japan', region: '関西', aliases: ['大津', 'おおつ', 'otsu'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    
    // 中国
    'hiroshima': { ...SAMPLE_WEATHER_DATA, name: 'Hiroshima', country: 'Japan', region: '中国', aliases: ['広島', 'ひろしま', 'hiroshima'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    'okayama': { ...SAMPLE_WEATHER_DATA, name: 'Okayama', country: 'Japan', region: '中国', aliases: ['岡山', 'おかやま', 'okayama'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'yamaguchi': { ...SAMPLE_WEATHER_DATA, name: 'Yamaguchi', country: 'Japan', region: '中国', aliases: ['山口', 'やまぐち', 'yamaguchi'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'tottori': { ...SAMPLE_WEATHER_DATA, name: 'Tottori', country: 'Japan', region: '中国', aliases: ['鳥取', 'とっとり', 'tottori'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 20 } },
    'matsue': { ...SAMPLE_WEATHER_DATA, name: 'Matsue', country: 'Japan', region: '中国', aliases: ['松江', 'まつえ', 'matsue'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 19 } },
    
    // 四国
    'takamatsu': { ...SAMPLE_WEATHER_DATA, name: 'Takamatsu', country: 'Japan', region: '四国', aliases: ['高松', 'たかまつ', 'takamatsu'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'matsuyama': { ...SAMPLE_WEATHER_DATA, name: 'Matsuyama', country: 'Japan', region: '四国', aliases: ['松山', 'まつやま', 'matsuyama'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    'kochi': { ...SAMPLE_WEATHER_DATA, name: 'Kochi', country: 'Japan', region: '四国', aliases: ['高知', 'こうち', 'kochi'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 24 } },
    'tokushima': { ...SAMPLE_WEATHER_DATA, name: 'Tokushima', country: 'Japan', region: '四国', aliases: ['徳島', 'とくしま', 'tokushima'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    
    // 九州・沖縄
    'fukuoka': {
      ...SAMPLE_WEATHER_DATA, name: 'Fukuoka', country: 'Japan', region: '九州',
      aliases: ['福岡', 'ふくおか', 'fukuoka'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 },
      weather: [{ main: "Clear", description: "晴れ", icon: "01d" }]
    },
    'kitakyushu': { ...SAMPLE_WEATHER_DATA, name: 'Kitakyushu', country: 'Japan', region: '九州', aliases: ['北九州', 'きたきゅうしゅう', 'kitakyushu'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'saga': { ...SAMPLE_WEATHER_DATA, name: 'Saga', country: 'Japan', region: '九州', aliases: ['佐賀', 'さが', 'saga'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'nagasaki': { ...SAMPLE_WEATHER_DATA, name: 'Nagasaki', country: 'Japan', region: '九州', aliases: ['長崎', 'ながさき', 'nagasaki'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    'kumamoto': { ...SAMPLE_WEATHER_DATA, name: 'Kumamoto', country: 'Japan', region: '九州', aliases: ['熊本', 'くまもと', 'kumamoto'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 24 } },
    'oita': { ...SAMPLE_WEATHER_DATA, name: 'Oita', country: 'Japan', region: '九州', aliases: ['大分', 'おおいた', 'oita'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } },
    'miyazaki': { ...SAMPLE_WEATHER_DATA, name: 'Miyazaki', country: 'Japan', region: '九州', aliases: ['宮崎', 'みやざき', 'miyazaki'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 25 } },
    'kagoshima': { ...SAMPLE_WEATHER_DATA, name: 'Kagoshima', country: 'Japan', region: '九州', aliases: ['鹿児島', 'かごしま', 'kagoshima'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 26 } },
    'naha': { ...SAMPLE_WEATHER_DATA, name: 'Naha', country: 'Japan', region: '沖縄', aliases: ['那覇', 'なは', 'naha'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 28 } },
    'okinawa': { ...SAMPLE_WEATHER_DATA, name: 'Okinawa', country: 'Japan', region: '沖縄', aliases: ['沖縄', 'おきなわ', 'okinawa'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 28 } },
    
    // 追加の主要都市
    'kawasaki': { ...SAMPLE_WEATHER_DATA, name: 'Kawasaki', country: 'Japan', region: '関東', aliases: ['川崎', 'かわさき', 'kawasaki'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 21 } },
    'sakai': { ...SAMPLE_WEATHER_DATA, name: 'Sakai', country: 'Japan', region: '関西', aliases: ['堺', 'さかい', 'sakai'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 24 } },
    'sagamihara': { ...SAMPLE_WEATHER_DATA, name: 'Sagamihara', country: 'Japan', region: '関東', aliases: ['相模原', 'さがみはら', 'sagamihara'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 20 } },
    'himeji': { ...SAMPLE_WEATHER_DATA, name: 'Himeji', country: 'Japan', region: '関西', aliases: ['姫路', 'ひめじ', 'himeji'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'hachioji': { ...SAMPLE_WEATHER_DATA, name: 'Hachioji', country: 'Japan', region: '関東', aliases: ['八王子', 'はちおうじ', 'hachioji'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 19 } },
    'funabashi': { ...SAMPLE_WEATHER_DATA, name: 'Funabashi', country: 'Japan', region: '関東', aliases: ['船橋', 'ふなばし', 'funabashi'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 20 } },
    'kagawa': { ...SAMPLE_WEATHER_DATA, name: 'Kagawa', country: 'Japan', region: '四国', aliases: ['香川', 'かがわ', 'kagawa'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 22 } },
    'ehime': { ...SAMPLE_WEATHER_DATA, name: 'Ehime', country: 'Japan', region: '四国', aliases: ['愛媛', 'えひめ', 'ehime'], main: { ...SAMPLE_WEATHER_DATA.main, temp: 23 } }
  };

  const FORECAST_DATA: ForecastData = {
    list: [
      { dt: Date.now() / 1000 + 3600, main: { temp: 24 }, weather: [{ main: "晴れ", description: "晴れ", icon: "01d" }] },
      { dt: Date.now() / 1000 + 7200, main: { temp: 26 }, weather: [{ main: "曇り", description: "曇り", icon: "02d" }] },
      { dt: Date.now() / 1000 + 10800, main: { temp: 23 }, weather: [{ main: "雨", description: "雨", icon: "09d" }] },
      { dt: Date.now() / 1000 + 14400, main: { temp: 20 }, weather: [{ main: "晴れ", description: "晴れ", icon: "01n" }] }
    ]
  };

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  // Utility functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeatherForDate = (date: Date) => {
    const weathers = ['☀️', '⛅', '🌧️', '☁️', '🌤️'];
    const temps = [18, 22, 25, 28, 20, 15, 30];
    const hash = date.getDate() + date.getMonth();
    return {
      icon: weathers[hash % weathers.length],
      temp: temps[hash % temps.length]
    };
  };

  const getWeatherIcon = (iconCode: string): string => {
    const icons: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return icons[iconCode] || '🌤️';
  };

  const calculateLevenshteinDistance = (a: string, b: string): number => {
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

  const calculateSimilarity = (input: string, target: string): number => {
    const distance = calculateLevenshteinDistance(input.toLowerCase(), target.toLowerCase());
    const maxLength = Math.max(input.length, target.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  };

  const fuzzySearch = (query: string, threshold = 0.3): CityData[] => {
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

  const getMatchTypeDescription = (matchType: string): string => {
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

  // API related functions
  const fetchWeatherFromAPI = async (cityName: string | null, lat: number | null = null, lon: number | null = null) => {
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

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
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

  // Main functions
  const findCityByName = (cityName: string): CityData | null => {
    const results = fuzzySearch(cityName, 0.3);
    return results.length > 0 ? results[0] : null;
  };

  const searchWeatherByName = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      if (apiMode === 'live' && apiKey) {
        const apiData = await fetchWeatherFromAPI(cityName);
        setWeatherData(apiData.weather);
        setForecastData(apiData.forecast);
        
        const newHistory = searchHistory.filter(item => item !== apiData.weather.name);
        setSearchHistory([apiData.weather.name, ...newHistory].slice(0, 5));
      } else {
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
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            if (apiMode === 'live' && apiKey) {
              const apiData = await fetchWeatherFromAPI(null, latitude, longitude);
              setWeatherData(apiData.weather);
              setForecastData(apiData.forecast);
              setSearchCity(apiData.weather.name);
            } else {
              await new Promise(resolve => setTimeout(resolve, 800));
              setWeatherData(SAMPLE_WEATHER_DATA);
              setForecastData(FORECAST_DATA);
              setSearchCity('Tokyo');
            }
            setLoading(false);
          } catch (error) {
            console.error('位置情報での天気取得エラー:', error);
            setError((error as Error).message || '位置情報での天気取得に失敗しました。');
            setLoading(false);
          }
        },
        (error) => {
          console.error('位置情報取得エラー:', error);
          setError('位置情報の取得に失敗しました。');
          setLoading(false);
        }
      );
    } else {
      setError('位置情報がサポートされていません。');
      setLoading(false);
    }
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
          <p className="text-blue-200 text-sm mt-1">🗾 日本全国対応 + OpenWeatherMap API連携</p>
          
          {/* API Mode Toggle */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 inline-block">
              <div className="flex items-center justify-center gap-3 text-white">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-lg font-semibold">{formatDate(currentDateTime)}</p>
                  <p className="text-sm text-blue-100">{formatTime(currentDateTime)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${apiMode === 'live' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  <span className="text-white text-sm">
                    {apiMode === 'live' ? 'リアルタイム' : 'デモモード'}
                  </span>
                </div>
                <button
                  onClick={toggleApiMode}
                  className="px-3 py-1 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-lg text-white text-sm transition-colors"
                  type="button"
                >
                  {apiMode === 'live' ? 'デモに切替' : 'API有効化'}
                </button>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-white text-sm mb-3">OpenWeatherMap APIキーを入力してください</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="APIキーを入力..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white bg-opacity-30 border border-white border-opacity-40 rounded text-white placeholder-white placeholder-opacity-70 text-sm"
                />
                <button
                  onClick={handleApiKeySubmit}
                  className="px-4 py-2 bg-green-500 bg-opacity-60 hover:bg-green-500 hover:bg-opacity-80 rounded text-white text-sm transition-colors"
                  type="button"
                >
                  設定
                </button>
                <button
                  onClick={() => setShowApiKeyInput(false)}
                  className="px-4 py-2 bg-gray-500 bg-opacity-60 hover:bg-gray-500 hover:bg-opacity-80 rounded text-white text-sm transition-colors"
                  type="button"
                >
                  キャンセル
                </button>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                💡 <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">
                  OpenWeatherMap
                </a> で無料APIキーを取得できます
              </p>
            </div>
          )}
        </header>

        {/* Search Section */}
        <section className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
          <div className="flex gap-3 relative">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-70 text-xl">🔍</span>
              <input
                type="text"
                placeholder="都市名を入力（例: 東京、札幌、福岡）"
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={searchCity}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => searchCity.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-95 rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(city.name)}
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
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {['Tokyo', 'Osaka', 'Kyoto', 'Sapporo', 'Fukuoka', 'Sendai', 'Hiroshima', 'Naha', 'Nagoya', 'Kanazawa', 'Matsuyama', 'Niigata'].map((city) => {
                const cityData = findCityByName(city);
                return (
                  <button
                    key={city}
                    onClick={() => handleSuggestionClick(city)}
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
                  className="p-2 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-xl text-white transition-colors text-xl"
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
                            className={`text-xs p-1 rounded mb-1 truncate flex items-center gap-1 ${EVENT_TYPES[event.type as keyof EventTypes]?.color || 'bg-gray-500'} ${EVENT_TYPES[event.type as keyof EventTypes]?.bgOpacity || 'bg-opacity-50'}`}
                          >
                            <span>{EVENT_TYPES[event.type as keyof EventTypes]?.icon || '📝'}</span>
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
                        <span>{EVENT_TYPES[event.type as keyof EventTypes]?.icon || '📝'}</span>
                        <span>{event.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded text-white ${EVENT_TYPES[event.type as keyof EventTypes]?.color || 'bg-gray-500'} ${EVENT_TYPES[event.type as keyof EventTypes]?.bgOpacity || 'bg-opacity-50'}`}>
                        {EVENT_TYPES[event.type as keyof EventTypes]?.label || '不明'}
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">エラー</span>
            </div>
            <p>{error}</p>
            {apiMode === 'live' && error.includes('APIキー') && (
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="mt-2 px-4 py-2 bg-white bg-opacity-30 hover:bg-white hover:bg-opacity-40 rounded-lg text-white text-sm transition-colors"
                type="button"
              >
                APIキーを設定
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white border-opacity-30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white">
              {apiMode === 'live' ? 'リアルタイム天気データを取得中...' : '天気データを取得中...'}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {apiMode === 'live' ? 'OpenWeatherMap APIから最新データを取得しています' : 'デモデータを読み込んでいます'}
            </p>
          </div>
        )}

        {/* Current Weather */}
        {weatherData && !loading && (
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
        )}

        {/* Forecast */}
        {forecastData && !loading && (
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
        )}

        {/* API Information */}
        <section className="bg-white bg-opacity-15 rounded-2xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">🌐</span>
            <h3 className="text-white font-semibold">API連携機能</h3>
          </div>
          <p className="text-blue-200 text-sm mb-3">
            {apiMode === 'live' 
              ? 'OpenWeatherMap APIからリアルタイムデータを取得中' 
              : 'デモモードで動作中（サンプルデータを使用）'
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-200">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-white">🎭 デモモード</h4>
              <ul className="text-left space-y-1">
                <li>• 日本の主要都市のサンプルデータ</li>
                <li>• あいまい検索機能</li>
                <li>• 多言語対応（日本語/英語）</li>
                <li>• 即座にレスポンス</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-white">🌍 リアルタイムモード</h4>
              <ul className="text-left space-y-1">
                <li>• 世界中の最新天気データ</li>
                <li>• 5日間詳細予報</li>
                <li>• 降水確率・視界・風向など</li>
                <li>• GPS位置情報対応</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-8 text-white text-opacity-70">
          <p>Built with React & OpenWeatherMap API</p>
          <p className="text-sm mt-2">
            🗾 日本全国対応 + 世界中の都市検索
          </p>
          <p className="text-xs mt-1 text-blue-200">
            💡 デモモード: サンプルデータ | リアルタイムモード: OpenWeatherMap API
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherApp;