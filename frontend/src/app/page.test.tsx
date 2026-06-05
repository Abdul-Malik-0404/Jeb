import { render, screen, waitFor } from '@testing-library/react';
import Page from './page';

// Mock the global fetch
global.fetch = jest.fn() as jest.Mock;

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders loading state initially', () => {
    // Setup a delayed fetch so we can see the loading state
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { container } = render(<Page />);
    // Since Loader2 renders an SVG with the lucide-react class, we can find it by class or role if we added one
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders dashboard overview correctly after fetching', async () => {
    // Mock the stats endpoint
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        hunts: 5,
        listings: 24,
        cvs: 2,
        avg_match_score: 85,
      }),
    });
    // Mock the hunts endpoint (Recent Hunts)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: '1', category: 'Software Engineer', region: 'Colombo', created_at: '2026-06-05T00:00:00Z' }
      ],
    });
    // Mock the cvs endpoint (Master CV Status)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: '10', title: 'My Master CV', is_master: true, created_at: '2026-06-01T00:00:00Z' }
      ],
    });

    render(<Page />);

    // Wait for the data to load and stats to render
    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });

    // Check stats are rendered
    expect(screen.getByText('Active Hunts')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    expect(screen.getByText('Jobs Found')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();

    // Check recent hunts are rendered
    expect(screen.getByText('Recent Hunts')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();

    // Check master cv status
    expect(screen.getByText('Master CV Status')).toBeInTheDocument();
    expect(screen.getByText('My Master CV')).toBeInTheDocument();
  });
});
