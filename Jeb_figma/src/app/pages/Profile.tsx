import { useState } from 'react';
import { Upload, FileText, Edit3, Download } from 'lucide-react';
import { mockUserProfile, mockBaseResume } from '../data/mockData';
import { ResumeViewer } from '../components/ResumeViewer';
import { ResumeEditor } from '../components/ResumeEditor';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile information and base resume
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-semibold">
                {mockUserProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3>{mockUserProfile.name}</h3>
                <p className="text-muted-foreground text-sm">{mockUserProfile.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="text-sm">{mockUserProfile.phone}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <p className="text-sm">{mockUserProfile.location}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Website</label>
                <p className="text-sm">{mockUserProfile.website}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">LinkedIn</label>
                <p className="text-sm">{mockUserProfile.linkedIn}</p>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Edit Profile Info
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4 mt-6">
            <h3>Upload New Resume</h3>
            <p className="text-muted-foreground text-sm">
              Upload a PDF or DOCX file to update your base resume
            </p>
            <label className="block">
              <input type="file" accept=".pdf,.docx" className="hidden" />
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF or DOCX (max 5MB)</p>
              </div>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3>Base Resume</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <FileText className="w-4 h-4" />
                      View Mode
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Edit Mode
                    </>
                  )}
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              This is your base resume. The AI will tailor it for each job posting.
            </div>

            {isEditing ? (
              <ResumeEditor resume={{ jobId: 'base', blocks: mockBaseResume, generatedAt: new Date().toISOString() }} />
            ) : (
              <ResumeViewer resume={{ jobId: 'base', blocks: mockBaseResume, generatedAt: new Date().toISOString() }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
