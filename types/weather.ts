export interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}

export interface ApiResponse {
  current: WeatherData,
  forecast: ForecastData[]
}
