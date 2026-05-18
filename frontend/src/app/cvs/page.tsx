"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CV {
  id: string;
  title: string;
  is_master: boolean;
  created_at: string;
}

export default function CVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [title, setTitle] = useState("");
  const [isMaster, setIsMaster] = useState(true);
  const [contentText, setContentText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    try {
      const res = await fetch(`${API_URL}/cvs`);
      const data = await res.json();
      setCvs(data);
    } catch (err) {
      console.error("Failed to fetch CVs", err);
    } finally {
      setFetching(false);
    }
  };

  const uploadCV = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("is_master", String(isMaster));
    if (contentText) formData.append("content_text", contentText);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/cvs`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setTitle("");
        setContentText("");
        setFile(null);
        fetchCvs();
      }
    } catch (err) {
      console.error("Failed to upload CV", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Curriculum Vitae</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your Master CV and tailored versions.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Form */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upload New CV</h2>
          <form onSubmit={uploadCV} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Software Engineer CV"
                className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 dark:focus:ring-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Source</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-xs font-medium transition-colors",
                    !file ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-zinc-200 dark:border-zinc-800"
                  )}
                >
                  Paste Text
                </button>
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-lg border py-2 text-xs font-medium transition-colors pointer-events-none",
                      file ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-zinc-200 dark:border-zinc-800"
                    )}
                  >
                    {file ? file.name : "Upload PDF"}
                  </button>
                </div>
              </div>
            </div>

            {!file && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Paste CV Text</label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 dark:focus:ring-white"
                  placeholder="Paste your CV content here..."
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMaster"
                checked={isMaster}
                onChange={(e) => setIsMaster(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black dark:border-zinc-800 dark:focus:ring-white"
              />
              <label htmlFor="isMaster" className="text-sm font-medium">Set as Master CV</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload CV
            </button>
          </form>
        </div>

        {/* CV List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your CVs</h2>
          {fetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : cvs.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No CVs found.</p>
          ) : (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className={cn("h-5 w-5", cv.is_master ? "text-blue-500" : "text-zinc-400")} />
                    <div>
                      <p className="text-sm font-medium">{cv.title}</p>
                      <p className="text-xs text-zinc-500">{new Date(cv.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {cv.is_master && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">
                      Master
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
