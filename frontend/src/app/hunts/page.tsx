"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

interface Hunt {
  id: string;
  category: string;
  region: string;
  created_at: string;
}

export default function HuntsPage() {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("Colombo, Sri Lanka");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";

  useEffect(() => {
    fetchHunts();
  }, []);

  const fetchHunts = async () => {
    try {
      const res = await fetch(`${API_URL}/hunts`);
      const data = await res.json();
      setHunts(data);
    } catch (err) {
      console.error("Failed to fetch hunts", err);
    } finally {
      setFetching(false);
    }
  };

  const startHunt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/hunts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, region }),
      });
      if (res.ok) {
        setCategory("");
        fetchHunts();
      }
    } catch (err) {
      console.error("Failed to start hunt", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Hunts</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Start a new scout or track your existing searches.</p>
      </div>

      <form onSubmit={startHunt} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Job Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 dark:focus:ring-white"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 dark:focus:ring-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Start Scout
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Previous Hunts</h2>
        {fetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : hunts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
            <p className="text-zinc-500">No hunts found. Start your first scout above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {hunts.map((hunt) => (
              <div
                key={hunt.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div>
                  <h3 className="font-bold">{hunt.category}</h3>
                  <p className="text-sm text-zinc-500">{hunt.region} • {new Date(hunt.created_at).toLocaleDateString()}</p>
                </div>
                <button className="text-sm font-medium text-black underline-offset-4 hover:underline dark:text-white">
                  View Listings
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
