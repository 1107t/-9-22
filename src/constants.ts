// constants.ts
import type { WeatherData, CityData, ForecastData, EventTypes } from './types';

export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export const EVENT_TYPES: EventTypes = {
  personal: { label: '個人', color: 'bg-blue-500', bgOpacity: 'bg-opacity-50', icon: '👤' },
  work: { label: '仕事', color: 'bg-red-500', bgOpacity: 'bg-opacity-50', icon: '💼' },
  company: { label: '会社', color: 'bg-orange-500', bgOpacity: 'bg-opacity-50', icon: '🏢' },
  social: { label: '社交', color: 'bg-green-500', bgOpacity: 'bg-opacity-50', icon: '🎉' },
  workout: { label: '運動', color: 'bg-purple-500', bgOpacity: 'bg-opacity-50', icon: '💪' }
};

export const SAMPLE_WEATHER_DATA: WeatherData = {
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

export const CITIES_DATA: { [key: string]: CityData } = {
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

export const FORECAST_DATA: ForecastData = {
  list: [
    { dt: Date.now() / 1000 + 3600, main: { temp: 24 }, weather: [{ main: "晴れ", description: "晴れ", icon: "01d" }] },
    { dt: Date.now() / 1000 + 7200, main: { temp: 26 }, weather: [{ main: "曇り", description: "曇り", icon: "02d" }] },
    { dt: Date.now() / 1000 + 10800, main: { temp: 23 }, weather: [{ main: "雨", description: "雨", icon: "09d" }] },
    { dt: Date.now() / 1000 + 14400, main: { temp: 20 }, weather: [{ main: "晴れ", description: "晴れ", icon: "01n" }] }
  ]
};

export const POPULAR_CITIES = ['Tokyo', 'Osaka', 'Kyoto', 'Sapporo', 'Fukuoka', 'Sendai', 'Hiroshima', 'Naha', 'Nagoya', 'Kanazawa', 'Matsuyama', 'Niigata'];