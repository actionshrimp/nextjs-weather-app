import { NextRequest } from 'next/server';
import { GET } from '@/app/api/weather/route';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock environment variables
process.env.OPENWEATHERMAP_API_KEY = 'test-api-key';

describe('Weather API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 if city parameter is missing', async () => {
    // Create a mock request without a city parameter
    const request = new NextRequest('http://localhost:3000/api/weather');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('City parameter is required');
  });

  it('returns 404 if city is not found', async () => {
    // Mock the fetch for a 404 response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'city not found' })
    });

    // Create a mock request with a non-existent city
    const request = new NextRequest('http://localhost:3000/api/weather?city=NonExistentCity');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('City not found');
  });

  it('returns weather data for a valid city', async () => {
    // Mock successful responses for both API calls
    const mockCurrentWeather = {
      main: { temp: 20, humidity: 70 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      wind: { speed: 5 },
      timezone: 0
    };

    const mockForecast = {
      list: [
        {
          dt: 1620000000, // Example timestamp
          main: { temp: 18 },
          weather: [{ description: 'few clouds', icon: '02d' }]
        },
        {
          dt: 1620086400, // Next day
          main: { temp: 22 },
          weather: [{ description: 'sunny', icon: '01d' }]
        }
      ]
    };

    // Setup the mock fetch responses
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrentWeather
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecast
      });

    // Create a mock request with a valid city
    const request = new NextRequest('http://localhost:3000/api/weather?city=London');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('current');
    expect(data).toHaveProperty('forecast');
    expect(data.current.temp).toBe(20);
    expect(data.current.description).toBe('clear sky');
  });

  it('handles API errors gracefully', async () => {
    // Mock a failed API call
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    // Create a mock request
    const request = new NextRequest('http://localhost:3000/api/weather?city=London');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe('Failed to fetch weather data');
  });
});
