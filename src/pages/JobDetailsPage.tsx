import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Award,
  Layers,
  GraduationCap,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { calculateJobMatch } from '../utils/matchingEngine';

export const JobDetailsPage: React.FC = () => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    activeProfile,
    toggleSaveJob,
    isJobSaved,
    addApplication,
    setCurrentRoute,
  } = useApp();

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || jobs[0];
  }, [jobs, selectedJobId]);

  const match = useMemo(() => {
    if (!activeProfile || !selectedJob) return null;
    return calculateJobMatch(activeProfile, selectedJob);
  }, [activeProfile, selectedJob]);

  if (!selectedJob) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No job selected.</p>
        <button
          onClick={() => setCurrentRoute('job-recommendations')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  const isSaved = isJobSaved(selectedJob.id);
  const scores = match?.scores;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Back button & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => setCurrentRoute('job-recommendations')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Recommendations
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => toggleSaveJob(selectedJob.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              isSaved
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {isSaved ? 'Job Saved' : 'Save Job'}
          </button>

          <button
            onClick={() => addApplication(selectedJob)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add to Application Tracker
          </button>

          <a
            href={selectedJob.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>Original Listing</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Main Job Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {selectedJob.category}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 capitalize">
                {selectedJob.workMode} • {selectedJob.employmentType}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300">
                Min {selectedJob.minYearsExperience} yrs exp
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedJob.title}
            </h1>
            <p className="text-sm text-slate-300">
              {selectedJob.company} • {selectedJob.location} • <strong className="text-white">{selectedJob.salaryRange}</strong>
            </p>
          </div>

          {/* Compatibility Score Widget */}
          {match && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-4 min-w-[200px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {match.scores.overall}%
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                  Overall Compatibility
                </span>
                <span className="text-xs font-semibold text-emerald-400 block mt-0.5">
                  {match.scores.overall >= 80 ? 'Strong Candidate Fit' : 'Moderate Alignment'}
                </span>
                <span className="text-[10px] text-slate-500 block">5-Factor Deterministic</span>
              </div>
            </div>
          )}
        </div>

        {/* 5-Factor Score Breakdown Progress Bars */}
        {scores && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Explainable Score Breakdown
              </h3>
              <span className="text-[11px] text-slate-400">Formula: Σ (Component Score × Weight)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Required Skills</span>
                  <span className="font-bold text-emerald-400">{scores.requiredSkillsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${scores.requiredSkillsScore}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Weight: {scores.weights.requiredSkills}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Preferred Skills</span>
                  <span className="font-bold text-blue-400">{scores.preferredSkillsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${scores.preferredSkillsScore}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Weight: {scores.weights.preferredSkills}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Experience Fit</span>
                  <span className="font-bold text-violet-400">{scores.experienceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-violet-400 h-full rounded-full" style={{ width: `${scores.experienceScore}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Weight: {scores.weights.experience}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Education Fit</span>
                  <span className="font-bold text-white">{scores.educationScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: `${scores.educationScore}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Weight: {scores.weights.education}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Role Fit</span>
                  <span className="font-bold text-amber-400">{scores.roleRelevanceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${scores.roleRelevanceScore}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Weight: {scores.weights.roleRelevance}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Human Readable Explanation */}
        {match && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Scoring Engine Assessment:</strong>
              {match.explanation}
            </div>
          </div>
        )}
      </div>

      {/* Matched vs Missing Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed Matched Skills ({match?.matchedRequiredSkills.length || 0})
            </h3>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified</span>
          </div>

          <div className="space-y-2.5">
            {match?.matchedRequiredSkills.map((skill) => {
              const candSkill = activeProfile?.skills.find((s) => s.name.toLowerCase().includes(skill.toLowerCase()));
              return (
                <div key={skill} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">✓ {skill}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Required
                    </span>
                  </div>
                  {candSkill?.evidence && (
                    <p className="text-[11px] text-slate-400 italic">
                      Resume Evidence: &quot;{candSkill.evidence}&quot;
                    </p>
                  )}
                </div>
              );
            })}
            {match?.matchedPreferredSkills.map((pref) => (
              <div key={pref} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300">✓ {pref}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    Preferred
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Missing Skills & Gaps ({match?.missingRequiredSkills.length || 0})
            </h3>
            <button
              onClick={() => setCurrentRoute('skill-gap')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Analyze Plan →
            </button>
          </div>

          <div className="space-y-2.5">
            {match?.missingRequiredSkills.map((skill) => (
              <div key={skill} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Gap: {skill}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">Mandatory Requirement</span>
                </div>
                <button
                  onClick={() => setCurrentRoute('skill-gap')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition"
                >
                  Bridge Gap
                </button>
              </div>
            ))}

            {match?.missingPreferredSkills.map((pref) => (
              <div key={pref} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">{pref}</span>
                  <span className="text-[10px] text-slate-500">Preferred Qualification</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Optional
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Next Steps */}
      {match && match.recommendedNextSteps && match.recommendedNextSteps.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            Recommended Action Plan Before Applying
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {match.recommendedNextSteps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
