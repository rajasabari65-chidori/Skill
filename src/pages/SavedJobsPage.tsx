import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bookmark,
  Briefcase,
  MapPin,
  Trash2,
  ArrowRight,
  Plus,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { calculateJobMatch } from '../utils/matchingEngine';

export const SavedJobsPage: React.FC = () => {
  const {
    savedJobs,
    toggleSaveJob,
    jobs,
    activeProfile,
    addApplication,
    setCurrentRoute,
    setSelectedJobId,
  } = useApp();

  const savedJobDetails = savedJobs
    .map((s) => {
      const job = jobs.find((j) => j.id === s.jobId);
      if (!job) return null;
      const match = activeProfile ? calculateJobMatch(activeProfile, job) : null;
      return {
        ...s,
        job,
        match,
      };
    })
    .filter(Boolean);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Jobs Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Saved Opportunities ({savedJobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Bookmarked positions kept ready for customized applications and screening preparation.
          </p>
        </div>

        <button
          onClick={() => setCurrentRoute('job-recommendations')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5 self-start sm:self-center"
        >
          Explore More Jobs <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Saved Jobs */}
      {savedJobDetails.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Saved Jobs Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the 24+ verified simulated vacancies and bookmark roles you are interested in applying to.
          </p>
          <button
            onClick={() => setCurrentRoute('job-recommendations')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Browse Recommendations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobDetails.map((item) => {
            if (!item) return null;
            const { job, match } = item;
            const score = match ? match.scores.overall : 0;

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {score}% Match
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium capitalize">
                        {job.workMode}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setCurrentRoute('job-details');
                    }}
                    className="text-base font-bold text-white hover:text-blue-400 transition cursor-pointer"
                  >
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{job.company}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="text-slate-200">{job.salaryRange}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setCurrentRoute('job-details');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => addApplication(job)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Track
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
