"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink, FileDown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  company: string;
  description: string;
  url: string;
  match_score: number | null;
  applied_status: boolean;
  created_at: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  };

  const tailorCV = async (listingId: string) => {
    setTailoring(true);
    try {
      const res = await fetch(`${API_URL}/tailor/${listingId}`, { method: "POST" });
      const data = await res.json();
      alert(`Tailoring task started: ${data.task_id}`);
    } catch (err) {
      console.error("Failed to tailor CV", err);
    } finally {
      setTailoring(false);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Job Listings</h1>
        <p className="text-muted-foreground mt-1">Manage and tailor your applications.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Listings List */}
        <div className="w-1/3 flex flex-col space-y-4 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : listings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No listings found.</p>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
                className={cn(
                  "cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md",
                  selectedListing?.id === listing.id
                    ? "border-primary bg-card shadow-sm"
                    : "border-border bg-card"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-foreground">{listing.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{listing.company}</p>
                  </div>
                  {listing.match_score !== null && (
                    <div className={cn(
                      "text-xs font-bold px-2 py-1 rounded",
                      listing.match_score > 70 ? "bg-green-100 text-green-700" :
                      listing.match_score > 40 ? "bg-yellow-100 text-yellow-700" :
                      "bg-secondary text-secondary-foreground"
                    )}>
                      {Math.round(listing.match_score)}%
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="flex-1 rounded-lg border border-border bg-card p-8 overflow-y-auto">
          {selectedListing ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedListing.title}</h2>
                  <p className="text-lg text-muted-foreground mt-1">{selectedListing.company}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={selectedListing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Original JD
                  </a>
                  <button
                    onClick={() => tailorCV(selectedListing.id)}
                    disabled={tailoring}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {tailoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                    Tailor CV
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border pb-2 text-foreground">Job Description</h3>
                <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedListing.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a job listing to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
