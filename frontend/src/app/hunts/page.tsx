"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Plus, X, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@asgardeo/auth-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";
  const { getAccessToken, state } = useAuthContext();

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchHunts();
    }
  }, [state.isAuthenticated]);

  const fetchHunts = async () => {
    if (!state.isAuthenticated) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_URL}/hunts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    if (!state.isAuthenticated) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_URL}/hunts`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ category, region }),
      });
      if (res.ok) {
        setCategory("");
        setIsModalOpen(false);
        fetchHunts();
      }
    } catch (err) {
      console.error("Failed to start hunt", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock function to generate random badges for visual parity with Figma
  const getMockBadges = (id: string) => {
    const charCode = id.charCodeAt(0) || 0;
    const isRemote = charCode % 2 === 0;
    const isFullTime = charCode % 3 !== 0;
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {isRemote && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Remote
          </span>
        )}
        {isFullTime && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            Full-time
          </span>
        )}
        {!isRemote && !isFullTime && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            Hybrid
          </span>
        )}
      </div>
    );
  };

  // Mock function to generate random active postings count
  const getMockActivePostings = (id: string) => {
    const charCode = id.charCodeAt(id.length - 1) || 0;
    return (charCode % 42) + 5;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Hunts</h1>
          <p className="text-muted-foreground mt-1">Manage your automated job scouts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Hunt
        </button>
      </div>

      <div className="pt-2">
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hunts.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg shadow-sm">
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">No active hunts</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create a new job hunt to start automatically scouting for opportunities that match your criteria.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Job Hunt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hunts.map((hunt) => (
              <Link
                key={hunt.id}
                href={`/hunts/${hunt.id}`}
                className="block group"
              >
                <div className="h-full flex flex-col p-6 bg-card border border-border rounded-xl hover:shadow-md transition-all hover:border-primary/50">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{hunt.category}</h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{hunt.region}</span>
                    </div>
                    {getMockBadges(hunt.id)}
                  </div>

                  <div className="mt-8 pt-4 border-t border-border flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{getMockActivePostings(hunt.id)}</div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Active Postings</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Create New Job Hunt</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={startHunt} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Job Title or Keyword</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Location / Region</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-10 items-center justify-center rounded-lg border border-border bg-transparent text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create Hunt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
