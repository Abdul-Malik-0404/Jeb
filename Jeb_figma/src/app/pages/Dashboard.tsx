import { Link } from 'react-router';
import { Plus, MapPin, Clock, Briefcase, TrendingUp } from 'lucide-react';
import { mockJobHunts } from '../data/mockData';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Job Hunts</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your active job searches
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Hunt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockJobHunts.map((hunt) => (
          <Link
            key={hunt.id}
            to={`/hunts/${hunt.id}`}
            className="block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:border-primary/50"
          >
            <div className="space-y-4">
              <div>
                <h3 className="mb-2">{hunt.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                    <Briefcase className="w-3 h-3" />
                    {hunt.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                    <MapPin className="w-3 h-3" />
                    {hunt.location}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Active Postings</span>
                  <span className="font-medium">{hunt.activePostings}</span>
                </div>
                {hunt.newPostings > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">New Today</span>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {hunt.newPostings}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-3 h-3" />
                  Created {new Date(hunt.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {mockJobHunts.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">No job hunts yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first job hunt to start finding opportunities
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Create Job Hunt
          </button>
        </div>
      )}
    </div>
  );
}
