"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, ExternalLink, FileText, Loader2, Play } from "lucide-react";

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

export default function JobPostingDetail() {
  const params = useParams();
  const huntId = params.huntId as string;
  const jobId = params.jobId as string;
  
  const [posting, setPosting] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";

  useEffect(() => {
    async function fetchPosting() {
      try {
        const res = await fetch(`${API_URL}/listings?hunt_id=${huntId}`);
        const data = await res.json();
        const found = data.find((l: Listing) => l.id === jobId);
        setPosting(found || null);
      } catch (err) {
        console.error("Failed to fetch posting", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (huntId && jobId) {
      fetchPosting();
    }
  }, [huntId, jobId, API_URL]);

  const tailorCV = async () => {
    if (!posting) return;
    setTailoring(true);
    try {
      const res = await fetch(`${API_URL}/tailor/${posting.id}`, { method: "POST" });
      const data = await res.json();
      alert(`Tailoring task started: ${data.task_id}`);
    } catch (err) {
      console.error("Failed to tailor CV", err);
    } finally {
      setTailoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!posting) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">Job posting not found</h2>
        <Link href={`/hunts/${huntId}`} className="text-primary hover:underline mt-4 inline-block font-medium">
          Back to Job Hunt
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/hunts/${huntId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Hunt
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{posting.title}</h2>
                <div className="flex items-center gap-2 text-lg text-muted-foreground mt-2">
                  <Building2 className="w-5 h-5" />
                  <span>{posting.company}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                Posted on {new Date(posting.created_at).toLocaleDateString()}
                {posting.applied_status && (
                  <span className="text-green-600 font-medium ml-2">• Applied</span>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <a
                  href={posting.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium text-sm"
                >
                  Original Posting
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={tailorCV}
                  disabled={tailoring}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {tailoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Tailor Master CV
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Job Description</h3>
            <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
              {posting.description}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Tailored Resume</h3>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              Generate a tailored resume for this specific job posting.
            </div>
            
            <div className="bg-muted rounded-lg p-6 text-center border border-dashed border-border">
              <p className="text-sm text-muted-foreground mb-4">
                No tailored resume has been generated yet for this posting.
              </p>
              <button
                onClick={tailorCV}
                disabled={tailoring}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
              >
                {tailoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Generate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
