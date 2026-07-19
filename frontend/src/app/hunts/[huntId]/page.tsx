"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, ExternalLink, Loader2, TrendingUp, Building2, Briefcase, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@asgardeo/auth-react";

interface Listing {
  id: string;
  hunt_id: string;
  title: string;
  company: string;
  description: string;
  url: string;
  match_score: number | null;
  applied_status: boolean;
  created_at: string;
}

interface Hunt {
  id: string;
  category: string;
  region: string;
  created_at: string;
}

export default function JobHuntDetail() {
  const params = useParams();
  const huntId = params.huntId as string;
  
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [postings, setPostings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";
  const { getAccessToken, state } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      if (!state.isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const token = await getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [huntsRes, listingsRes] = await Promise.all([
          fetch(`${API_URL}/hunts`, { headers }),
          fetch(`${API_URL}/listings?hunt_id=${huntId}`, { headers })
        ]);
        
        const huntsData = await huntsRes.json();
        const listingsData = await listingsRes.json();
        
        const currentHunt = huntsData.find((h: Hunt) => h.id === huntId);
        setHunt(currentHunt || null);
        setPostings(listingsData);
      } catch (err) {
        console.error("Failed to fetch hunt details", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (huntId) {
      fetchData();
    }
  }, [huntId, API_URL, state.isAuthenticated, getAccessToken]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hunt) {
    return (
      <div className="text-center py-16 bg-card border border-border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-foreground">Job hunt not found</h2>
        <Link href="/hunts" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 mt-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Job Hunts
        </Link>
      </div>
    );
  }

  // Mock function to generate random badges for visual parity with Figma
  const getMockBadges = (id: string) => {
    const charCode = id.charCodeAt(0) || 0;
    const isRemote = charCode % 2 === 0;
    const isFullTime = charCode % 3 !== 0;
    return (
      <>
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
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/hunts"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Hunts
        </Link>

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{hunt.category}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" />
                {hunt.region}
              </span>
              {getMockBadges(hunt.id)}
            </div>
          </div>

          <div className="bg-card border border-border px-6 py-4 rounded-xl shadow-sm text-center md:text-right min-w-[160px]">
            <div className="text-3xl font-bold text-foreground">{postings.length}</div>
            <div className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-wider">Active Postings</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {postings.map((posting) => (
          <a
            key={posting.id}
            href={posting.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/50 group"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {posting.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mt-2 text-sm">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Building2 className="w-4 h-4" />
                      {posting.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {posting.company.includes("Remote") || posting.title.includes("Remote") ? "Remote" : hunt.region}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
                    Posted {new Date(posting.created_at).toLocaleDateString()}
                  </span>
                  {posting.applied_status && (
                    <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-md">
                      <div className="w-2 h-2 rounded-full bg-current" />
                      Applied
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
                  {posting.description}
                </p>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:pl-6">
                {posting.match_score !== null ? (
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap font-bold text-sm shadow-sm border",
                    posting.match_score > 70 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' 
                      : 'bg-primary/5 text-primary border-primary/20 dark:bg-primary/10'
                  )}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{Math.round(posting.match_score)}% Match</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-sm text-muted-foreground border border-border bg-secondary/50">
                    <Briefcase className="w-4 h-4" />
                    <span>Not Scored</span>
                  </div>
                )}

                <div className="hidden md:flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:underline underline-offset-4 mt-auto pt-8">
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex md:hidden items-center justify-center gap-1.5 text-primary text-sm font-semibold group-hover:underline underline-offset-4">
              View Details
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        ))}

        {postings.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-xl shadow-sm">
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No job postings yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              The autonomous scout is currently searching the web for opportunities matching your criteria. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
