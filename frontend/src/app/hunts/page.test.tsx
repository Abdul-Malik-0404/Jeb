import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HuntsPage from './page';

// Mock the global fetch
global.fetch = jest.fn() as jest.Mock;

describe('Hunts Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { container } = render(<HuntsPage />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders no hunts state when empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
    });

    render(<HuntsPage />);

    await waitFor(() => {
      expect(screen.getByText('No hunts found')).toBeInTheDocument();
    });
  });

  it('renders hunts list when data is available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: '1', category: 'Software Engineer', region: 'Colombo', created_at: '2026-06-05T00:00:00Z' }
      ],
    });

    render(<HuntsPage />);

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Colombo')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  it('allows starting a new hunt', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
    });

    render(<HuntsPage />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. Software Engineer')).toBeInTheDocument();
    });

    // Fill form
    const categoryInput = screen.getByPlaceholderText('e.g. Software Engineer');
    const regionInput = screen.getAllByRole('textbox')[1]; // Region input
    
    fireEvent.change(categoryInput, { target: { value: 'Data Scientist' } });
    fireEvent.change(regionInput, { target: { value: 'Remote' } });

    // Mock the POST request for starting a hunt
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'started' })
    });
    // Mock the subsequent GET request to reload hunts
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        { id: '2', category: 'Data Scientist', region: 'Remote', created_at: '2026-06-05T00:00:00Z' }
      ]
    });

    const submitBtn = screen.getByRole('button', { name: /start scout/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/hunts'), expect.objectContaining({
        method: 'POST',
      }));
    });
  });
});
