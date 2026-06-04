import { useTheme } from 'next-themes';
import { Moon, Sun, User, Bell, Lock, Database } from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3>Appearance</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Customize how Jeb looks on your device
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3>Profile</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Update your personal information and resume
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3>Notifications</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage how you receive updates about new job postings
                </p>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Email notifications for new job matches</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Daily digest of job hunt activity</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Push notifications on mobile</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3>Data & Privacy</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your data and privacy settings
                </p>
                <div className="mt-4 space-y-3">
                  <button className="text-sm text-primary hover:underline">
                    Download my data
                  </button>
                  <br />
                  <button className="text-sm text-destructive hover:underline">
                    Delete my account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3>Security</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Update your password and security preferences
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="mb-4">About Jeb</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>© 2026 Jeb. All rights reserved.</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            <a href="#" className="text-primary hover:underline">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
}
