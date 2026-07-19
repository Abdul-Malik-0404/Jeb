"use client";

import { useState, useEffect } from "react";
import { Upload, Loader2, Phone, Mail, MapPin, Globe, Link as LinkIcon, GripVertical, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@asgardeo/auth-react";

interface CV {
  id: string;
  title: string;
  is_master: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [title, setTitle] = useState("");
  const [isMaster, setIsMaster] = useState(true);
  const [contentText, setContentText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editMode, setEditMode] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://100.121.119.73:8000";
  const { getAccessToken, state } = useAuthContext();

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchCvs();
    }
  }, [state.isAuthenticated]);

  const fetchCvs = async () => {
    if (!state.isAuthenticated) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_URL}/cvs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    if (!state.isAuthenticated) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("is_master", String(isMaster));
    if (contentText) formData.append("content_text", contentText);
    if (file) formData.append("file", file);

    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_URL}/cvs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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

  const hasMaster = cvs.some(cv => cv.is_master);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and base resume.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        
        {/* Left Column */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div className="h-24 w-24 rounded-full bg-secondary text-4xl flex items-center justify-center text-secondary-foreground font-semibold mb-4">
                JD
              </div>
              <h2 className="text-xl font-bold text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">Software Engineer</p>
            </div>
            
            <div className="py-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                john.doe@example.com
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Globe className="h-4 w-4 text-muted-foreground" />
                johndoe.dev
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">linkedin.com/in/johndoe</span>
              </div>
            </div>
            
            <button className="w-full inline-flex h-10 items-center justify-center rounded-lg border border-border bg-transparent px-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              Edit Profile Info
            </button>
          </div>

          {/* Upload Form */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Upload New Resume</h3>
            <form onSubmit={uploadCV} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Software Engineer CV"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Source</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className={cn(
                      "flex-1 rounded-md border py-2 text-xs font-medium transition-colors",
                      !file ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"
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
                        "w-full rounded-md border py-2 text-xs font-medium transition-colors pointer-events-none",
                        file ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"
                      )}
                    >
                      {file ? "PDF Uploaded" : "Upload PDF"}
                    </button>
                  </div>
                </div>
              </div>

              {!file && (
                <div className="space-y-2">
                  <textarea
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Paste your CV content here..."
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isMaster"
                  checked={isMaster}
                  onChange={(e) => setIsMaster(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary bg-background"
                />
                <label htmlFor="isMaster" className="text-sm font-medium text-foreground cursor-pointer">Set as Master</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload Resume
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Base Resume */}
        <div className="md:col-span-8">
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-semibold text-foreground">Base Resume</h3>
              <div className="flex bg-secondary p-1 rounded-lg">
                <button
                  onClick={() => setEditMode(true)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    editMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Edit Mode
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    !editMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  View Mode
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 bg-background">
              {fetching ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !hasMaster ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                  <FileText className="h-12 w-12 opacity-20" />
                  <p>No master resume found.</p>
                  <p className="text-sm">Upload a master resume on the left to see its extracted building blocks here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Mock Blocks for Master CV */}
                  {[
                    "Header (Contact Info)",
                    "Professional Summary",
                    "Experience: Software Engineer at TechCorp",
                    "Experience: Frontend Developer at StartupX",
                    "Skills (Technical & Soft)",
                    "Projects: E-commerce Dashboard",
                    "Education: BS Computer Science"
                  ].map((block, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "group flex items-center gap-3 p-4 rounded-lg border border-border bg-card transition-all",
                        editMode ? "hover:border-primary/50 cursor-grab active:cursor-grabbing" : ""
                      )}
                    >
                      {editMode && (
                        <GripVertical className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{block}</p>
                      </div>
                      {editMode && (
                        <div className="text-xs text-muted-foreground/70">Drag to reorder</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
