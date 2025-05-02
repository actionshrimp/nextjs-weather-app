"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      router.push(`/weather/${encodeURIComponent(city.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-8">Weather Forecast</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Enter a city name
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., London"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Get Weather
          </button>
        </form>
      </div>
    </div>
  );
}
