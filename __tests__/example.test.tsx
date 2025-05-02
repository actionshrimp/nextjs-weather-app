import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Example test', () => {
  it('renders a heading', () => {
    // This is just an example test
    const { container } = render(<h1>Hello World</h1>);
    const heading = screen.getByRole('heading', { level: 1 });
    
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Hello World');
  });
});
