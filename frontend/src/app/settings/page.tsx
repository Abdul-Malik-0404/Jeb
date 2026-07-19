"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, User, Bell, Database, Shield } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-2">
                <Moon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize how Jeb looks on your device</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md transition-colors ${
                  theme === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md transition-colors ${
                  theme === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-2">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Profile</h3>
                <p className="text-sm text-muted-foreground">Update your personal information and resume</p>
              </div>
            </div>
            <a href="/cvs" className="inline-flex h-9 items-center justify-center rounded-lg bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Edit Profile
            </a>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-secondary p-2 mt-1">
              <Bell className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="space-y-4 w-full">
              <div>
                <h3 className="font-medium text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage how you receive updates about new job postings</p>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-foreground">Email notifications for new job matches</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-foreground">Daily digest of job hunt activity</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-foreground">Push notifications on mobile</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-secondary p-2 mt-1">
              <Database className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">Data & Privacy</h3>
                <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
              </div>
              <div className="space-y-3 flex flex-col items-start">
                <button className="text-sm font-medium text-foreground hover:underline">Download my data</button>
                <button className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline">Delete my account</button>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-2">
                <Shield className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Security</h3>
                <p className="text-sm text-muted-foreground">Update your password and security preferences</p>
              </div>
            </div>
            <button className="inline-flex h-9 items-center justify-center rounded-lg bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        {/* About Jeb */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-medium text-foreground">About Jeb</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-sm text-muted-foreground">© 2026 Jeb. All rights reserved.</p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-sm text-foreground hover:underline">Terms of Service</a>
              <a href="#" className="text-sm text-foreground hover:underline">Privacy Policy</a>
              <a href="#" className="text-sm text-foreground hover:underline">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
