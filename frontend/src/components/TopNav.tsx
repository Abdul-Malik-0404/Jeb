"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Settings, User } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">Jeb</span>
            </Link>

            <div className="flex gap-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive('/') && !pathname.startsWith('/hunts') && !pathname.startsWith('/settings') && !pathname.startsWith('/cvs')
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/hunts"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive('/hunts')
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
              href="/cvs"
              className={`p-2 rounded-md transition-colors ${
                isActive('/cvs')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/settings"
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
  );
}
