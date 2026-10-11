import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Target,
  Layers,
  CheckCircle2,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { calculateJobMatch } from '../utils/matchingEngine';

export const CareerAnalyticsPage: React.FC = () => {
  const { activeProfile, jobs, applications, learningRoadmap } = useApp();

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

  // Matches for all jobs
  const jobMatches = useMemo(() => {
    if (!activeProfile) return [];
    return jobs.map((j) => ({
      job: j,
      match: calculateJobMatch(activeProfile, j),
    }));
  }, [activeProfile, jobs]);

  // Average match score
  const avgMatchScore = useMemo(() => {
    if (jobMatches.length === 0) return 0;
    const sum = jobMatches.reduce((acc, m) => acc + m.match.scores.overall, 0);
    return Math.round(sum / jobMatches.length);
  }, [jobMatches]);

  // Skill category counts
  const skillCategoryData = useMemo(() => {
    if (!activeProfile) return [];
    const counts: Record<string, number> = {};
    activeProfile.skills.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [activeProfile]);

  // Application Funnel
  const funnelData = useMemo(() => {
    return [
      { stage: 'Interested', count: applications.filter((a) => a.status === 'Interested').length },
      { stage: 'Applied', count: applications.filter((a) => a.status === 'Applied').length },
      { stage: 'Assessment', count: applications.filter((a) => a.status === 'Assessment').length },
      { stage: 'Interview', count: applications.filter((a) => a.status === 'Interview').length },
      { stage: 'Offer', count: applications.filter((a) => a.status === 'Offer').length },
    ];
  }, [applications]);

  // Match score buckets
  const matchBuckets = useMemo(() => {
    const buckets = [
      { score: '90-100%', count: 0 },
      { score: '80-89%', count: 0 },
      { score: '70-79%', count: 0 },
      { score: '60-69%', count: 0 },
      { score: '<60%', count: 0 },
    ];
    jobMatches.forEach((m) => {
      const s = m.match.scores.overall;
      if (s >= 90) buckets[0].count++;
      else if (s >= 80) buckets[1].count++;
      else if (s >= 70) buckets[2].count++;
      else if (s >= 60) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [jobMatches]);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytical Benchmarking & Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Career Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Quantitative metrics derived from your candidate profile and 24 simulated engineering job specs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Avg Match Score</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{avgMatchScore}%</span>
          <span className="text-[11px] text-slate-500">Across 24 jobs</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Identified Skills</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">
            {activeProfile?.skills.length || 0}
          </span>
          <span className="text-[11px] text-slate-500">Confirmed in resume</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Roadmap Progress</span>
          <span className="text-2xl font-black text-violet-400 mt-1 block">
            {learningRoadmap?.overallProgress || 0}%
          </span>
          <span className="text-[11px] text-slate-500">Milestones completed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Tracked Applications</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {applications.length}
          </span>
          <span className="text-[11px] text-slate-500">In recruitment pipeline</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Score Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-1">Match Compatibility Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Number of available jobs in each compatibility bracket</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchBuckets}>
                <XAxis dataKey="score" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {matchBuckets.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Category Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white mb-1">Skill Composition by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown of validated technical competencies</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
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
          <div className="grid grid-cols-2 gap-2 mt-2">
            {skillCategoryData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 truncate">{item.name}:</span>
                <span className="font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Funnel Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-white mb-1">Application Pipeline Funnel</h3>
          <p className="text-xs text-slate-400 mb-4">Current distribution of jobs across your recruitment pipeline</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="stage" type="category" stroke="#64748B" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 6, 6, 0]}>
                  {funnelData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
