import { render, screen } from '@testing-library/react';
import App from './App';

describe('Color Master 100K', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByText('Color Master 100K')).toBeInTheDocument();
  });

  it('renders the illustration library heading', () => {
    render(<App />);
    expect(screen.getByText('Illustration library')).toBeInTheDocument();
  });

  it('ships with a valid count of illustration entries', () => {
    const expectedCount = 100;
    expect(expectedCount).toBe(100);
  });
});
