import { render, screen } from '@testing-library/react';
import { TopNav } from './TopNav';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next/link to just render children in an anchor tag
jest.mock('next/link', () => {
  return ({ children, href, className }: { children: React.ReactNode, href: string, className: string }) => {
    return <a href={href} className={className}>{children}</a>;
  };
});

describe('TopNav', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (usePathname as jest.Mock).mockReset();
  });

  it('renders correctly', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<TopNav />);
    
    expect(screen.getByText('Jeb')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Job Hunts')).toBeInTheDocument();
  });

  it('highlights Dashboard when on root path', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<TopNav />);
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveClass('bg-accent text-accent-foreground');
  });

  it('highlights Job Hunts when on /hunts path', () => {
    (usePathname as jest.Mock).mockReturnValue('/hunts');
    render(<TopNav />);
    
    const huntsLink = screen.getByText('Job Hunts');
    expect(huntsLink).toHaveClass('bg-accent text-accent-foreground');
  });
});
