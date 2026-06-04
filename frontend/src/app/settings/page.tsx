"use client";

import { Settings, Shield, User, Bell } from "lucide-react";

const sections = [
  {
    name: "Profile",
    description: "Manage your personal information and preferences.",
    icon: User,
  },
  {
    name: "API Configuration",
    description: "Configure your Gemini API key and other integrations.",
    icon: Shield,
  },
  {
    name: "Notifications",
    description: "Choose what updates you want to receive.",
    icon: Bell,
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <div
            key={section.name}
            className="flex items-start gap-6 rounded-lg border border-border bg-card p-6"
          >
            <div className="rounded-lg bg-secondary p-3">
              <section.icon className="h-6 w-6 text-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{section.name}</h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <div className="pt-4">
                <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6">
        <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-destructive/80 mt-1">Permanently delete all your data and account.</p>
        <button className="mt-4 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">
          Delete Data
        </button>
      </div>
    </div>
  );
}
