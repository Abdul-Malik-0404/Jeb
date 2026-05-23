"use client";

import { useState, useEffect } from "react";
import { Briefcase, FileText, Search, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

interface Stats {
  hunts: number;
  listings: number;
  cvs: number;
  avg_match_score: number;
}

interface Hunt {
  id: string;
  category: string;
  region: string;
  created_at: string;
}

interface CV {
  id: string;
  title: string;
  is_master: boolean;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentHunts, setRecentHunts] = useState<Hunt[]>([]);
  const [masterCv, setMasterCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, huntsRes, cvsRes] = await Promise.all([
          fetch(`${API_URL}/stats`),
          fetch(`${API_URL}/hunts`),
          fetch(`${API_URL}/cvs`)
        ]);

        const statsData = await statsRes.json();
        const huntsData = await huntsRes.json();
        const cvsData = await cvsRes.json();

        setStats(statsData);
        setRecentHunts(huntsData.slice(-3).reverse());
        setMasterCv(cvsData.find((cv: CV) => cv.is_master) || null);
      } catch (err) {
        console.error("Dashboard failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  const statCards = [
    { name: "Active Hunts", value: stats?.hunts || 0, icon: Search },
    { name: "Jobs Found", value: stats?.listings || 0, icon: Briefcase },
    { name: "Total CVs", value: stats?.cvs || 0, icon: FileText },
    { name: "Avg. Match Score", value: `${stats?.avg_match_score || 0}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Real-time status of your autonomous job search.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                <stat.icon className="h-5 w-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Hunts</h2>
            <Link href="/hunts" className="text-sm text-zinc-500 hover:text-black dark:hover:text-white underline underline-offset-4">View All</Link>
          </div>
          <div className="space-y-4">
            {recentHunts.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4">No hunts recorded yet.</p>
            ) : (
              recentHunts.map((hunt) => (
                <div key={hunt.id} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800">
                  <div>
                    <p className="font-medium">{hunt.category}</p>
                    <p className="text-sm text-zinc-500">{hunt.region} • {new Date(hunt.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link href="/listings" className="text-sm font-medium text-black dark:text-white">
                    Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="col-span-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold">Master CV Status</h2>
          <div className="mt-4">
            {masterCv ? (
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium truncate max-w-[180px]">{masterCv.title}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Master Version</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
                <p className="text-sm text-zinc-500">No Master CV set.</p>
              </div>
            )}
            <Link href="/cvs" className="block mt-4">
              <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                {masterCv ? "Update Master CV" : "Upload CV"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
