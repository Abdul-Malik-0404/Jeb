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
        <h1 className="text-2xl font-bold tracking-tight">Job Listings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage and tailor your applications.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Listings List */}
        <div className="w-1/3 flex flex-col space-y-4 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : listings.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No listings found.</p>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md",
                  selectedListing?.id === listing.id
                    ? "border-black bg-white shadow-sm dark:border-white dark:bg-zinc-900"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{listing.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{listing.company}</p>
                  </div>
                  {listing.match_score !== null && (
                    <div className={cn(
                      "text-xs font-bold px-2 py-1 rounded",
                      listing.match_score > 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      listing.match_score > 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
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
        <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50 overflow-y-auto">
          {selectedListing ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedListing.title}</h2>
                  <p className="text-lg text-zinc-500">{selectedListing.company}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={selectedListing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Original JD
                  </a>
                  <button
                    onClick={() => tailorCV(selectedListing.id)}
                    disabled={tailoring}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {tailoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                    Tailor CV
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 dark:border-zinc-800">Job Description</h3>
                <div className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                  {selectedListing.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              Select a job listing to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
