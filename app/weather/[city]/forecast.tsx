'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WeatherData, ForecastData } from '@/types/weather';
import Image from 'next/image';

type props = { data: ForecastData };

export default function Forecast({ data }: props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2">{data.date}</h3>
          <p className="text-2xl font-bold">{Math.round(data.temp)}°C</p>
          <p className="text-gray-600 capitalize">{data.description}</p>
        </div>
        <Image
          alt={data.description}
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
