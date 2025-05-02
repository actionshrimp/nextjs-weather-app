import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Forecast from '@/app/weather/[city]/forecast';
import { ForecastData } from '@/types/weather';

const data: ForecastData = {
  date: '2025-05-02',
  tempMin: 10,
  tempMax: 20,
  description: 'windy',
  icon: '10b',
};

describe('Example test', () => {
  it('renders a heading with a formatted date', () => {
    const { container } = render(<Forecast data={data} />);
    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Fri');
  });
});
