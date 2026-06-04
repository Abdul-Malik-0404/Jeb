import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, MapPin, DollarSign, Calendar, ExternalLink, FileText, Edit3, Download } from 'lucide-react';
import { mockJobPostings, getTailoredResume } from '../data/mockData';
import { ResumeViewer } from '../components/ResumeViewer';
import { ResumeEditor } from '../components/ResumeEditor';

export function JobPostingDetail() {
  const { huntId, jobId } = useParams();
  const posting = mockJobPostings.find(p => p.id === jobId);
  const tailoredResume = jobId ? getTailoredResume(jobId) : null;
  const [isEditing, setIsEditing] = useState(false);

  if (!posting) {
    return (
      <div className="text-center py-12">
        <h2>Job posting not found</h2>
        <Link to={`/hunts/${huntId}`} className="text-primary hover:underline mt-4 inline-block">
          Back to Job Hunt
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/hunts/${huntId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Hunt
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h2 className="mb-2">{posting.title}</h2>
                <p className="text-lg text-muted-foreground">{posting.company}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded">
                  <MapPin className="w-4 h-4" />
                  {posting.location}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded">
                  <DollarSign className="w-4 h-4" />
                  {posting.salary}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded">
                  {posting.type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Posted on {new Date(posting.postedDate).toLocaleDateString()}
              </div>

              <a
                href={posting.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply on Company Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3>Job Description</h3>
            <p className="text-muted-foreground">{posting.description}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3>Requirements</h3>
            <ul className="space-y-2">
              {posting.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3>Responsibilities</h3>
            <ul className="space-y-2">
              {posting.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3>Tailored Resume</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title={isEditing ? "View Mode" : "Edit Mode"}
                >
                  {isEditing ? <FileText className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </button>
                <button
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              AI-generated and tailored for this position
            </div>

            {tailoredResume && (
              isEditing ? (
                <ResumeEditor resume={tailoredResume} />
              ) : (
                <ResumeViewer resume={tailoredResume} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
