'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WeatherData, ForecastData } from '@/types/weather';
import Image from 'next/image';

export default function WeatherPage() {
  const params = useParams();
  const city = params.city as string;

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch weather data');
        }

        const data = await response.json();
        setCurrentWeather(data.current);
        setForecast(data.forecast);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-xl">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Link href="/" className="text-blue-500 hover:underline">
          Go back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to search
      </Link>

      <h1 className="text-3xl font-bold mb-6">Weather for {city}</h1>

      {currentWeather && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold">Current Weather</h2>
              <p className="text-4xl font-bold mt-2">{Math.round(currentWeather.temp)}°C</p>
              <p className="text-gray-600 capitalize">{currentWeather.description}</p>
            </div>
            <div className="text-right">
              <Image
                alt={currentWeather.description}
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                width={100}
                height={100}
              />
              <div className="flex flex-col">
                <span className="text-gray-600">Humidity: {currentWeather.humidity}%</span>
                <span className="text-gray-600">Wind: {currentWeather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {forecast && forecast.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">3-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{day.date}</h3>
                    <p className="text-2xl font-bold">{Math.round(day.temp)}°C</p>
                    <p className="text-gray-600 capitalize">{day.description}</p>
                  </div>
                  <Image
                    alt={day.description}
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
