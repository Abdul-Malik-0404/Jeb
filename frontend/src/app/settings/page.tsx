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
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your account and application preferences.</p>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <div
            key={section.name}
            className="flex items-start gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
              <section.icon className="h-6 w-6 text-black dark:text-white" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold">{section.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{section.description}</p>
              <div className="pt-4">
                <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-400">Danger Zone</h2>
        <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">Permanently delete all your data and account.</p>
        <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
          Delete Data
        </button>
      </div>
    </div>
  );
}
