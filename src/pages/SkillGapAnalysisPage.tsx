import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  Code2,
  FolderGit2,
  Sparkles,
  HelpCircle,
  Briefcase,
  Layers,
} from 'lucide-react';
import { generateSkillGapsForJob } from '../utils/matchingEngine';

export const SkillGapAnalysisPage: React.FC = () => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    activeProfile,
    setCurrentRoute,
    setLearningRoadmap,
  } = useApp();

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || jobs[0];
  }, [jobs, selectedJobId]);

  const gaps = useMemo(() => {
    if (!activeProfile || !selectedJob) return [];
    return generateSkillGapsForJob(activeProfile, selectedJob);
  }, [activeProfile, selectedJob]);

  // Group by status
  const strongMatches = gaps.filter((g) => g.status === 'strong-match');
  const missingRequired = gaps.filter((g) => g.status === 'missing-required');
  const missingPreferred = gaps.filter((g) => g.status === 'missing-preferred');
  const needsVerification = gaps.filter((g) => g.status === 'needs-verification');

  const handleExportToRoadmap = () => {
    if (!selectedJob) return;
    const skillsToPlan = missingRequired.map((g) => g.skillName);

    // Call server or generate roadmap directly
    const milestones = missingRequired.map((gap, index) => ({
      id: `ms-${gap.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      skillName: gap.skillName,
      title: `Mastery Sprint: ${gap.skillName}`,
      description: gap.whatToLearn,
      currentProficiency: 'Beginner' as const,
      targetProficiency: 'Proficient' as const,
      miniProject: gap.suggestedProject,
      practiceTasks: [
        gap.practiceExercise,
        `Build unit tests and benchmark ${gap.skillName} performance`,
        `Integrate ${gap.skillName} into portfolio project`,
      ],
      recommendedResources: [
        { title: `${gap.skillName} Documentation`, url: 'https://docs.github.com', type: 'doc' as const },
      ],
      estimatedHours: 15 + index * 5,
      completed: false,
    }));

    setLearningRoadmap({
      id: `roadmap-${Date.now()}`,
      targetRole: selectedJob.category,
      targetJobTitle: selectedJob.title,
      createdAt: new Date().toISOString(),
      overallProgress: 0,
      milestones,
    });

    setCurrentRoute('learning-roadmap');
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Targeted Skill Gap Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Skill Gaps for: {selectedJob.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {selectedJob.company} • Compare confirmed competencies against strict prerequisites.
          </p>
        </div>

        {/* Change Target Job Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden md:inline">Inspect Role:</span>
          <select
            value={selectedJob.id}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-400 block">Strong Matches</span>
          <span className="text-2xl font-black text-white mt-1 block">{strongMatches.length}</span>
          <span className="text-[11px] text-slate-400">Prerequisites satisfied</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-xs font-semibold text-amber-400 block">Missing Required</span>
          <span className="text-2xl font-black text-white mt-1 block">{missingRequired.length}</span>
          <span className="text-[11px] text-slate-400">Critical screening gaps</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30">
          <span className="text-xs font-semibold text-blue-400 block">Missing Preferred</span>
          <span className="text-2xl font-black text-white mt-1 block">{missingPreferred.length}</span>
          <span className="text-[11px] text-slate-400">Differentiating bonuses</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Action Item</span>
          <button
            onClick={handleExportToRoadmap}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Build Study Roadmap
          </button>
        </div>
      </div>

      {/* Priority 1: Missing Required Skills (Deep Dive) */}
      {missingRequired.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              High Priority: Missing Mandatory Skills ({missingRequired.length})
            </h2>
            <span className="text-xs text-slate-400">Estimated closing time: 2 - 4 weeks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missingRequired.map((gap) => (
              <div
                key={gap.skillName}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Critical Prerequisite
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{gap.skillName}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{gap.estimatedDuration}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-400 block mb-0.5">Why this role requires it:</span>
                    <p className="text-slate-300 leading-relaxed">{gap.whyRequired}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-400 block mb-0.5">What to learn:</span>
                    <p className="text-slate-300 leading-relaxed">{gap.whatToLearn}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" /> Hands-on Practice Task:
                    </span>
                    <p className="text-slate-300">{gap.practiceExercise}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-violet-400 flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5" /> Suggested Portfolio Project:
                    </span>
                    <p className="text-slate-300">{gap.suggestedProject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority 2: Strong Matches Verified */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Satisfied Core Requirements ({strongMatches.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {strongMatches.map((m) => (
            <div key={m.skillName} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">✓ {m.skillName}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Matched</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                {m.existingEvidence || 'Verified in candidate technical skills.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority 3: Preferred Qualifications */}
      {missingPreferred.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-blue-400 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Preferred Bonus Qualifications ({missingPreferred.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {missingPreferred.map((pref) => (
              <div key={pref.skillName} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{pref.skillName}</span>
                  <span className="text-[10px] text-slate-500">{pref.estimatedDuration}</span>
                </div>
                <p className="text-xs text-slate-400">{pref.whatToLearn}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
