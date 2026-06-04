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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Job Hunts</h1>
        <p className="text-muted-foreground mt-1">Start a new scout or track your existing searches.</p>
      </div>

      <form onSubmit={startHunt} className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">Job Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full rounded-lg border border-input bg-input-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-lg border border-input bg-input-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Start Scout
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Previous Hunts</h2>
        {fetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hunts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center bg-card">
            <p className="text-muted-foreground">No hunts found. Start your first scout above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {hunts.map((hunt) => (
              <div
                key={hunt.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div>
                  <h3 className="font-bold text-foreground">{hunt.category}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{hunt.region} • {new Date(hunt.created_at).toLocaleDateString()}</p>
                </div>
                <button className="text-sm font-medium text-primary hover:underline underline-offset-4">
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
