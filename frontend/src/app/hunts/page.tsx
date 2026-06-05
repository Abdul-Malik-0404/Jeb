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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Hunts</h1>
          <p className="text-muted-foreground mt-1">Start a new scout or track your existing searches.</p>
        </div>
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

      <div className="pt-4">
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hunts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2 text-lg font-medium text-foreground">No hunts found</h3>
            <p className="text-muted-foreground mb-4">Start your first scout above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hunts.map((hunt) => (
              <a
                key={hunt.id}
                href={`/hunts/${hunt.id}`}
                className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{hunt.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm font-medium">
                        {hunt.region}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-4">
                      Created {new Date(hunt.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
