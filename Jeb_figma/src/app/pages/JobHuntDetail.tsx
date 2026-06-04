import { Link, useParams } from 'react-router';
import { ArrowLeft, MapPin, DollarSign, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import { mockJobHunts, mockJobPostings } from '../data/mockData';

export function JobHuntDetail() {
  const { huntId } = useParams();
  const hunt = mockJobHunts.find(h => h.id === huntId);
  const postings = mockJobPostings.filter(p => p.huntId === huntId);

  if (!hunt) {
    return (
      <div className="text-center py-12">
        <h2>Job hunt not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Hunts
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1>{hunt.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded">
                <MapPin className="w-4 h-4" />
                {hunt.location}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded">
                {hunt.jobType}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-semibold text-primary">{postings.length}</div>
            <div className="text-muted-foreground text-sm">Active Postings</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {postings.map((posting) => (
          <Link
            key={posting.id}
            to={`/hunts/${huntId}/jobs/${posting.id}`}
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary/50"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="mb-1">{posting.title}</h3>
                  <p className="text-muted-foreground">{posting.company}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{posting.matchScore}% Match</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {posting.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {posting.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted {new Date(posting.postedDate).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {posting.description}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {posting.requirements.length} requirements • {posting.responsibilities.length} responsibilities
                </span>
                <span className="flex items-center gap-1 text-primary text-sm font-medium">
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {postings.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <h3 className="mb-2">No job postings yet</h3>
          <p className="text-muted-foreground">
            We're scanning the web for opportunities matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
