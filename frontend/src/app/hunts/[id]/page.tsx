"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, ExternalLink, Loader2, TrendingUp, Building2 } from "lucide-react";

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
  const huntId = params.id as string;
  
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [postings, setPostings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";

  useEffect(() => {
    async function fetchData() {
      try {
        const [huntsRes, listingsRes] = await Promise.all([
          fetch(`${API_URL}/hunts`),
          fetch(`${API_URL}/listings?hunt_id=${huntId}`)
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
  }, [huntId, API_URL]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hunt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">Job hunt not found</h2>
        <Link href="/hunts" className="text-primary hover:underline mt-4 inline-block font-medium">
          Back to Job Hunts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/hunts"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Hunts
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{hunt.category}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm font-medium">
                <MapPin className="w-4 h-4" />
                {hunt.region}
              </span>
            </div>
          </div>

          <div className="text-right bg-card border border-border px-6 py-3 rounded-lg">
            <div className="text-3xl font-bold text-primary">{postings.length}</div>
            <div className="text-muted-foreground text-sm font-medium">Listings Found</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {postings.map((posting) => (
          <Link
            key={posting.id}
            href={`/hunts/${huntId}/jobs/${posting.id}`}
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary/50 group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{posting.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Building2 className="w-4 h-4" />
                    <span>{posting.company}</span>
                  </div>
                </div>
                {posting.match_score !== null && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${posting.match_score > 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/10 text-primary'}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">{Math.round(posting.match_score)}% Match</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  Posted {new Date(posting.created_at).toLocaleDateString()}
                </span>
                {posting.applied_status && (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    • Applied
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {posting.description}
              </p>

              <div className="flex justify-end items-center pt-4 border-t border-border mt-4">
                <span className="flex items-center gap-1 text-primary text-sm font-semibold group-hover:underline underline-offset-4">
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {postings.length === 0 && (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-bold text-foreground mb-2">No job postings yet</h3>
          <p className="text-muted-foreground">
            The autonomous scout is searching the web for opportunities matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
