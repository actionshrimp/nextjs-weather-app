'use client';

import { useEffect, useState } from 'react';

export default function LoadingSpinner() {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <div className="flex items-center">
        <span className="text-xl">Loading weather data</span>
        <span className="w-8 text-xl">{dots}</span>
      </div>
      <div className="mt-4 text-sm text-gray-500">Fetching the latest forecast...</div>
    </div>
  );
}
