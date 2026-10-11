import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Briefcase,
  FileText,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Bookmark,
  Kanban,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart2,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { calculateJobMatch } from '../utils/matchingEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    user,
    activeProfile,
    jobs,
    savedJobs,
    applications,
    learningRoadmap,
    setCurrentRoute,
    setSelectedJobId,
  } = useApp();

  // Match calculations across available jobs
  const jobMatches = useMemo(() => {
    if (!activeProfile) return [];
    return jobs.map((job) => ({
      job,
      match: calculateJobMatch(activeProfile, job),
    }));
  }, [activeProfile, jobs]);

  // Recommended jobs with high compatibility (>= 75%)
  const recommendedJobs = useMemo(() => {
    return jobMatches
      .filter((m) => m.match.scores.overall >= 75)
      .sort((a, b) => b.match.scores.overall - a.match.scores.overall);
  }, [jobMatches]);

  // Skill category breakdown data for charts
  const skillCategoryData = useMemo(() => {
    if (!activeProfile) return [];
    const counts: Record<string, number> = {};
    activeProfile.skills.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [activeProfile]);

  // Match distribution data for chart
  const matchDistributionData = useMemo(() => {
    const buckets = [
      { range: '90-100%', count: 0 },
      { range: '80-89%', count: 0 },
      { range: '70-79%', count: 0 },
      { range: '60-69%', count: 0 },
      { range: '<60%', count: 0 },
    ];
    jobMatches.forEach((m) => {
      const score = m.match.scores.overall;
      if (score >= 90) buckets[0].count++;
      else if (score >= 80) buckets[1].count++;
      else if (score >= 70) buckets[2].count++;
      else if (score >= 60) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [jobMatches]);

  // Identified priority missing skills across recommended jobs
  const topMissingSkills = useMemo(() => {
    const freq: Record<string, number> = {};
    jobMatches.slice(0, 10).forEach((m) => {
      m.match.missingRequiredSkills.forEach((s) => {
        freq[s] = (freq[s] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [jobMatches]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Career Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.displayName || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Analyzing profile against <strong className="text-white">{jobs.length} verified simulated roles</strong>.
              You have <strong className="text-emerald-400">{recommendedJobs.length} roles</strong> matching above 75% compatibility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentRoute('upload-resume')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Upload Resume
            </button>
            <button
              onClick={() => setCurrentRoute('job-recommendations')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              View Matches
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Jobs</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{jobs.length}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Simulated dataset</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 14 technical career domains</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High Matches</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">{recommendedJobs.length}</span>
            <span className="text-[11px] text-slate-400">≥75% score</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Immediate fit based on profile skills</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Extracted Skills</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-violet-400">
              {activeProfile?.skills.length || 0}
            </span>
            <span className="text-[11px] text-slate-400">Verified</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Backed by evidence in resume</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Applications</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">{applications.length}</span>
            <span className="text-[11px] text-slate-400">In Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {applications.filter((a) => a.status === 'Interview').length} interview rounds
          </p>
        </div>
      </div>

      {/* Quick-Action Panel */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Career Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setCurrentRoute('upload-resume')}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 transition text-left group"
          >
            <FileText className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition" />
            <h3 className="text-xs font-bold text-white">Upload Resume</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Parse PDF or DOCX</p>
          </button>

          <button
            onClick={() => setCurrentRoute('resume-analysis')}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800/60 transition text-left group"
          >
            <Sparkles className="w-5 h-5 text-violet-400 mb-2 group-hover:scale-110 transition" />
            <h3 className="text-xs font-bold text-white">Analyze Skills</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Gemini semantic breakdown</p>
          </button>

          <button
            onClick={() => setCurrentRoute('job-recommendations')}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition text-left group"
          >
            <Briefcase className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition" />
            <h3 className="text-xs font-bold text-white">Find Jobs</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">24+ matched openings</p>
          </button>

          <button
            onClick={() => setCurrentRoute('skill-gap')}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 transition text-left group"
          >
            <Target className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition" />
            <h3 className="text-xs font-bold text-white">Skill Gaps</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Practice exercises & tasks</p>
          </button>

          <button
            onClick={() => setCurrentRoute('career-assistant')}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition text-left group"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition" />
            <h3 className="text-xs font-bold text-white">Ask Career AI</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Grounded interview coaching</p>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Top Matches & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Top Recommended Openings</h2>
                <p className="text-xs text-slate-400">Ranked by 5-factor compatibility score</p>
              </div>
              <button
                onClick={() => setCurrentRoute('job-recommendations')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                View All {jobs.length} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {recommendedJobs.slice(0, 4).map(({ job, match }) => (
                <div
                  key={job.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-850/40 transition rounded-xl px-2 -mx-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white hover:text-blue-400 cursor-pointer"
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setCurrentRoute('job-details');
                        }}
                      >
                        {job.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium capitalize">
                        {job.workMode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {job.company} • {job.location} • <span className="text-slate-300">{job.salaryRange}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {match.matchedRequiredSkills.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          ✓ {s}
                        </span>
                      ))}
                      {match.missingRequiredSkills.slice(0, 2).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                          Gap: {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-400">
                        {match.scores.overall}%
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Match</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setCurrentRoute('job-details');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-xs font-semibold transition"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recharts Chart: Match Score Distribution */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Job Match Score Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">How your candidate skills align across all 24 available job listings</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matchDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="range" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#E2E8F0' }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                    {matchDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Skill Category Breakdown & Roadmap Preview */}
        <div className="space-y-6">
          {/* Skill Breakdown Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Skill Category Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">Identified competencies from your active resume</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {skillCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#E2E8F0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {skillCategoryData.slice(0, 4).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.count} skills</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Missing Skills Widget */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white">Priority Skill Gaps</h2>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Most requested missing skills in top matched roles:
            </p>
            <div className="space-y-2.5">
              {topMissingSkills.map(([skill, count]) => (
                <div key={skill} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{skill}</span>
                    <span className="text-[10px] text-slate-500">Requested in {count} top roles</span>
                  </div>
                  <button
                    onClick={() => setCurrentRoute('skill-gap')}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Study Plan →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress Widget */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-white">Learning Roadmap</h2>
              <span className="text-xs font-bold text-blue-400">{learningRoadmap?.overallProgress || 0}% Complete</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Target: <strong className="text-white">{learningRoadmap?.targetRole || 'Software Engineering'}</strong>
            </p>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-4 border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${learningRoadmap?.overallProgress || 0}%` }}
              />
            </div>
            <button
              onClick={() => setCurrentRoute('learning-roadmap')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition text-center"
            >
              Continue Milestones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
