import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { message: "City parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Get current weather
    const currentWeatherResponse = await axios.get(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    // Get forecast data
    const forecastResponse = await axios.get(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    // Process current weather data
    const currentWeather = {
      temp: currentWeatherResponse.data.main.temp,
      description: currentWeatherResponse.data.weather[0].description,
      humidity: currentWeatherResponse.data.main.humidity,
      windSpeed: currentWeatherResponse.data.wind.speed,
      icon: currentWeatherResponse.data.weather[0].icon,
    };

    // Process forecast data - get one forecast per day for the next 3 days
    const forecastList = forecastResponse.data.list;
    const dailyForecasts: any[] = [];
    const processedDates = new Set();

    // Start from tomorrow (skip today's forecasts)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    for (const forecast of forecastList) {
      const forecastDate = new Date(forecast.dt * 1000);
      const dateString = forecastDate.toISOString().split("T")[0];
      
      // Only include forecasts for future dates and around noon (12-15h)
      if (
        forecastDate >= tomorrow && 
        !processedDates.has(dateString) &&
        forecastDate.getHours() >= 12 && 
        forecastDate.getHours() <= 15
      ) {
        dailyForecasts.push({
          date: new Date(forecast.dt * 1000).toLocaleDateString("en-GB", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          temp: forecast.main.temp,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
        });
        
        processedDates.add(dateString);
        
        // Stop after we have 3 days
        if (dailyForecasts.length === 3) {
          break;
        }
      }
    }

    return NextResponse.json({
      current: currentWeather,
      forecast: dailyForecasts,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(
        { message: "City not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
