// types.ts
export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}

export interface WeatherWind {
  speed: number;
}

export interface WeatherSys {
  country: string;
}

export interface WeatherData {
  name: string;
  main: WeatherMain;
  weather: WeatherCondition[];
  wind: WeatherWind;
  sys: WeatherSys;
  dt?: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: WeatherCondition[];
}

export interface ForecastData {
  list: ForecastItem[];
}

export interface CityData extends WeatherData {
  country: string;
  region: string;
  aliases: string[];
  score?: number;
  matchType?: string;
}

export interface Event {
  time: string;
  title: string;
  type: string;
}

export interface EventType {
  label: string;
  color: string;
  bgOpacity: string;
  icon: string;
}

export interface Events {
  [key: string]: Event[];
}

export interface EventTypes {
  personal: EventType;
  work: EventType;
  company: EventType;
  social: EventType;
  workout: EventType;
}

export type ApiMode = 'demo' | 'live';