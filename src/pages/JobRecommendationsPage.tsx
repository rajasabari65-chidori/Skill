import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Building,
  SlidersHorizontal,
  Plus,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { calculateJobMatch } from '../utils/matchingEngine';
import { JobListing, WorkMode, ExperienceLevel } from '../types';

export const JobRecommendationsPage: React.FC = () => {
  const {
    jobs,
    activeProfile,
    savedJobs,
    toggleSaveJob,
    isJobSaved,
    addApplication,
    setCurrentRoute,
    setSelectedJobId,
  } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [selectedExpLevel, setSelectedExpLevel] = useState<string>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'exp'>('match');

  // Compute matches for all jobs
  const jobMatches = useMemo(() => {
    return jobs.map((job) => {
      const match = activeProfile
        ? calculateJobMatch(activeProfile, job)
        : null;
      return {
        job,
        match,
        overallScore: match ? match.scores.overall : 0,
      };
    });
  }, [jobs, activeProfile]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(jobs.map((j) => j.category));
    return ['all', ...Array.from(set)];
  }, [jobs]);

  // Filter & sort
  const filteredJobs = useMemo(() => {
    return jobMatches
      .filter(({ job, overallScore }) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchSkills) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && job.category !== selectedCategory) {
          return false;
        }

        // Work mode filter
        if (selectedWorkMode !== 'all' && job.workMode !== selectedWorkMode) {
          return false;
        }

        // Experience filter
        if (selectedExpLevel !== 'all' && job.experienceLevel !== selectedExpLevel) {
          return false;
        }

        // Min match score filter
        if (overallScore < minMatchScore) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.overallScore - a.overallScore;
        }
        if (sortBy === 'date') {
          return new Date(b.job.verifiedAt).getTime() - new Date(a.job.verifiedAt).getTime();
        }
        if (sortBy === 'exp') {
          return a.job.minYearsExperience - b.job.minYearsExperience;
        }
        return 0;
      });
  }, [
    jobMatches,
    searchQuery,
    selectedCategory,
    selectedWorkMode,
    selectedExpLevel,
    minMatchScore,
    sortBy,
  ]);

  const handleInspectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentRoute('job-details');
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Step 3: Deterministic Job Compatibility Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Matching Job Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Compare candidate skills against {jobs.length} verified simulated job vacancies.
          Scores are mathematically calculated based on required skills (50%), preferred qualifications (20%), and experience (15%).
        </p>
      </div>

      {/* Simulated Data Transparency Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Simulated Job Dataset Notice:</strong> All listings feature realistic requirements and verified simulated employer domains to ensure reliable offline demonstration.
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          Provider: Simulated Verified Exchange
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skill, company..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Role Categories ({jobs.length})</option>
              {categories.filter((c) => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode Filter */}
          <div>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Any Work Mode</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-Site</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="match">Sort by: Best Match Score</option>
              <option value="date">Sort by: Newest Verified</option>
              <option value="exp">Sort by: Experience (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Match Score Slider & Quick Pill Filters */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Min Compatibility Score:</span>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-32 accent-blue-500 cursor-pointer"
            />
            <span className="font-bold text-blue-400 min-w-8">{minMatchScore}%+</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Showing <strong className="text-white">{filteredJobs.length}</strong> of {jobs.length} jobs</span>
            {(searchQuery || selectedCategory !== 'all' || selectedWorkMode !== 'all' || minMatchScore > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedWorkMode('all');
                  setMinMatchScore(0);
                }}
                className="text-blue-400 hover:underline ml-2"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Jobs Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, lowering the minimum match threshold, or selecting another role category.
            </p>
          </div>
        ) : (
          filteredJobs.map(({ job, match, overallScore }) => {
            const isSaved = isJobSaved(job.id);
            return (
              <div
                key={job.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl transition group relative"
              >
                <div>
                  {/* Top Bar: Match Score & Save Button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 border shadow-sm ${
                          overallScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : overallScore >= 70
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <span className="text-sm">{overallScore}%</span>
                        <span className="text-[10px] uppercase font-semibold">Match</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium capitalize">
                        {job.workMode}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-xl transition ${
                        isSaved
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Job'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Job Title & Company */}
                  <h3
                    onClick={() => handleInspectJob(job.id)}
                    className="text-base font-bold text-white hover:text-blue-400 transition cursor-pointer line-clamp-1"
                  >
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {job.company}
                  </p>

                  {/* Meta Strip */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">{job.salaryRange}</span>
                  </div>

                  {/* Brief Description */}
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills Breakdown Tags */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Required Skills:</span>
                      {match && (
                        <span className="text-emerald-400 text-[10px]">
                          {match.matchedRequiredSkills.length} of {job.requiredSkills.length} matched
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((skill) => {
                        const isMatched = match?.matchedRequiredSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              isMatched
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleInspectJob(job.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    Compare Fit <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => addApplication(job)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                    title="Track application"
                  >
                    <Plus className="w-3.5 h-3.5" /> Track
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
