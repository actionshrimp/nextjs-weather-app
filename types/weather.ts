export interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  temp: number;
  description: string;
  icon: string;
}
