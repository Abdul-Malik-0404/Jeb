import { Outlet, Link, useLocation } from 'react-router';
import { Briefcase, Settings, User } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">Jeb</span>
              </Link>

              <div className="flex gap-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive('/') && !location.pathname.startsWith('/settings') && !location.pathname.startsWith('/profile')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  Job Hunts
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className={`p-2 rounded-md transition-colors ${
                  isActive('/profile')
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                to="/settings"
                className={`p-2 rounded-md transition-colors ${
                  isActive('/settings')
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
