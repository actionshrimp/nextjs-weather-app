import { ForecastData } from '@/types/weather';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ message: 'City parameter is required' }, { status: 400 });
  }

  try {
    // Get current weather
    const currentWeatherResponse = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.json();
      if (currentWeatherResponse.status === 404) {
        return NextResponse.json({ message: 'City not found' }, { status: 404 });
      }
      throw new Error(errorData.message || 'Failed to fetch current weather data');
    }

    const currentWeatherData = await currentWeatherResponse.json();

    // Get forecast data
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData = await forecastResponse.json();
    const timezone = currentWeatherData.timezone;

    // Process current weather data
    const currentWeather = {
      temp: currentWeatherData.main.temp,
      description: currentWeatherData.weather[0].description,
      humidity: currentWeatherData.main.humidity,
      windSpeed: currentWeatherData.wind.speed,
      icon: currentWeatherData.weather[0].icon,
    };

    // Process forecast data - get one forecast per day for the next 3 days
    const forecastList = forecastData.list;
    const dailyForecasts: Record<string, ForecastData> = {};

    for (const forecast of forecastList) {
      const forecastDate = new Date((forecast.dt + timezone) * 1000);
      const dateString: string = forecastDate.toISOString().split('T')[0];

      const current = dailyForecasts[dateString] ?? {
        date: dateString,
        tempMin: forecast.main.temp,
        tempMax: forecast.main.temp,
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon,
      }

      if (forecast.main.temp < current.tempMin) {
        current.tempMin = forecast.main.temp
      }
      if (forecast.main.temp > current.tempMax) {
        current.tempMax = forecast.main.temp
      }

      dailyForecasts[dateString] = current;
    }

    const forecast = []
    for (let [date, f] of Object.entries(dailyForecasts)) {
      forecast.push(f)
    }

    return NextResponse.json({
      current: currentWeather,
      forecast: forecast,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ message: 'Failed to fetch weather data' }, { status: 500 });
  }
}
