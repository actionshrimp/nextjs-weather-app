'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WeatherData, ForecastData } from '@/types/weather';
import Image from 'next/image';
import Forecast from './forecast';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function WeatherPage() {
  const params = useParams();
  const city = params.city as string;

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecastDaysCount, setForecastDaysCount] = useState<number>(3);
  const [refreshedAt, setRefreshedAt] = useState<Date>(new Date());

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
  }, [city, refreshedAt]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoadingSpinner />
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

  const available = forecast?.length ?? 0;
  const toDisplay = forecast?.slice(0, forecastDaysCount);

  const dataRefreshedAt = new Date(refreshedAt).toLocaleDateString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return (
    <div className="py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to search
      </Link>
      <div className="flex justify-between align-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Weather for {currentWeather?.cityName}, {currentWeather?.countryCode}
          </h1>
          <div>Data refreshed at: {dataRefreshedAt}</div>
        </div>
        <button
          onClick={() => setRefreshedAt(() => new Date())}
          className="h-10 bg-orange-400 rounded p-2 font-bold"
        >
          Refresh
        </button>
      </div>
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
      {toDisplay && toDisplay.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toDisplay.map(data => (
              <Forecast key={data.date} data={data} />
            ))}
          </div>
        </div>
      )}
      {forecastDaysCount < available && (
        <button
          className="bg-white rounded-lg shadow-md p-2 mt-6 mb-6 w-full"
          onClick={_e => setForecastDaysCount((x: number) => x + 3)}
        >
          Load more
        </button>
      )}
    </div>
  );
}
