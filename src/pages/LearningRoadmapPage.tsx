import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  FolderGit2,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LearningRoadmapPage: React.FC = () => {
  const {
    learningRoadmap,
    toggleMilestone,
    setLearningRoadmap,
    activeProfile,
    jobs,
    selectedJobId,
  } = useApp();

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleGenerateRoadmap = async () => {
    setGenerating(true);

    try {
      const missingSkills = ['Docker', 'System Design', 'PostgreSQL Optimization', 'AWS'];
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: selectedJob.category,
          missingSkills,
        }),
      });

      const data = await response.json();
      if (data.milestones) {
        setLearningRoadmap({
          id: `roadmap-${Date.now()}`,
          targetRole: selectedJob.category,
          targetJobTitle: selectedJob.title,
          createdAt: new Date().toISOString(),
          overallProgress: 0,
          milestones: data.milestones,
        });
      }
    } catch (err) {
      console.error('Roadmap error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const milestones = learningRoadmap?.milestones || [];
  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Targeted Skill Upskilling Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Targeting: <strong className="text-white">{learningRoadmap?.targetRole || selectedJob.category}</strong>
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={generating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-2 self-start sm:self-center"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Recalculating Milestones...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Regenerate Curriculum
            </>
          )}
        </button>
      </div>

      {/* Progress Hero Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curriculum Completion
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {progressPercent}% Complete
            </div>
          </div>
          <span className="text-xs text-slate-400">
            {completedCount} of {milestones.length} milestones checked
          </span>
        </div>

        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Compass className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Roadmap Generated Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Regenerate Curriculum&quot; to build tailored milestones based on your skill gap analysis.
            </p>
          </div>
        ) : (
          milestones.map((milestone, idx) => {
            const isExpanded = expandedId === milestone.id || expandedId === null;
            return (
              <div
                key={milestone.id}
                className={`rounded-3xl border transition p-6 ${
                  milestone.completed
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleMilestone(milestone.id)}
                      className={`p-1.5 rounded-xl transition mt-0.5 ${
                        milestone.completed
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-500 hover:text-white bg-slate-950'
                      }`}
                      title={milestone.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          Milestone {idx + 1} • {milestone.skillName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          Est. {milestone.estimatedHours} hours
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {milestone.currentProficiency} → {milestone.targetProficiency}
                        </span>
                      </div>

                      <h3
                        className={`text-base font-bold cursor-pointer ${
                          milestone.completed ? 'text-slate-300 line-through' : 'text-white'
                        }`}
                        onClick={() => toggleMilestone(milestone.id)}
                      >
                        {milestone.title}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === milestone.id ? '' : milestone.id)}
                    className="text-slate-500 hover:text-white p-1 rounded-lg"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details: Tasks & Mini Project */}
                {isExpanded && (
                  <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <span className="font-bold text-blue-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" /> Actionable Practice Tasks:
                      </span>
                      <ul className="space-y-1.5">
                        {milestone.practiceTasks.map((task, tIdx) => (
                          <li key={tIdx} className="text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <span className="font-bold text-violet-400 flex items-center gap-1.5">
                        <FolderGit2 className="w-4 h-4" /> Suggested Mini-Project:
                      </span>
                      <p className="text-slate-300 leading-relaxed">{milestone.miniProject}</p>

                      {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                        <div className="pt-2 border-t border-slate-900 mt-2">
                          <span className="text-[10px] text-slate-500 block mb-1">
                            Curated Resources:
                          </span>
                          {milestone.recommendedResources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-400 hover:underline block truncate"
                            >
                              🔗 {res.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
