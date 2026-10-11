import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Briefcase,
  Layers,
} from 'lucide-react';

export const ResumeImprovementStudioPage: React.FC = () => {
  const { activeProfile, setActiveProfile, jobs, selectedJobId } = useApp();

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const [sectionType, setSectionType] = useState<'bullet' | 'summary' | 'project'>('bullet');
  const [inputText, setInputText] = useState(
    'Responsible for building the user dashboard and helped with database queries and backend APIs.'
  );
  const [improvedResult, setImprovedResult] = useState<{
    improvedText: string;
    keyChanges: string[];
    recruiterRationale: string;
    keywordsAdded: string[];
  } | null>({
    improvedText:
      'Architected and shipped responsive multi-tenant dashboard in React and TypeScript, optimizing PostgreSQL querying routines to decrease API response times by [X%].',
    keyChanges: [
      'Replaced passive verb "Responsible for building" with decisive active verbs "Architected and shipped"',
      'Explicitly cited technical stack (React, TypeScript, PostgreSQL) for ATS keyword indexation',
      'Structured bullet point around business outcome with quantifiable placeholder [X%]',
    ],
    recruiterRationale:
      'Technical hiring managers look for active ownership and architectural impact. Anchoring the contribution to measurable outcomes significantly improves interview callback rates.',
    keywordsAdded: ['TypeScript', 'PostgreSQL', 'Query Optimization', 'API Latency'],
  });

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImproveRequest = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/improve-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType,
          text: inputText,
          targetRole: selectedJob.category,
          targetJobTitle: selectedJob.title,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Improvement failed');
      }

      setImprovedResult({
        improvedText: data.improvedText,
        keyChanges: data.keyChanges || ['Enhanced technical impact', 'Improved active verb strength'],
        recruiterRationale: data.recruiterRationale || 'Better alignment with recruiter expectations.',
        keywordsAdded: data.keywordsAdded || [selectedJob.category],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Improvement request failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!improvedResult) return;
    navigator.clipboard.writeText(improvedResult.improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptIntoProfile = () => {
    if (!activeProfile || !improvedResult) return;

    if (sectionType === 'summary') {
      setActiveProfile({
        ...activeProfile,
        summary: improvedResult.improvedText,
      });
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Resume Improvement Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Bullet Point & Summary Refiner
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Transform passive statements into quantifiable, ATS-optimized engineering accomplishments.
          Grounded in Google Gemini with strict anti-hallucination safeguards.
        </p>
      </div>

      {/* Target Job Context Pill */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">
            Tailoring for: <strong className="text-white">{selectedJob.title}</strong> at{' '}
            <strong className="text-white">{selectedJob.company}</strong>
          </span>
        </div>
        <span className="text-slate-500 text-[11px] hidden sm:inline">
          Required Keywords: {selectedJob.requiredSkills.slice(0, 3).join(', ')}
        </span>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setSectionType('bullet');
            setInputText('Responsible for building the user dashboard and helped with database queries and backend APIs.');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            sectionType === 'bullet'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Work Experience Bullet Point
        </button>

        <button
          onClick={() => {
            setSectionType('summary');
            setInputText(activeProfile?.summary || 'Software developer looking for full-time opportunities.');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            sectionType === 'summary'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Professional Summary
        </button>

        <button
          onClick={() => {
            setSectionType('project');
            setInputText('Created a chat application using React and websockets. Users could send messages.');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            sectionType === 'project'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Project Showcase
        </button>
      </div>

      {/* Studio Workspace Grid: Original vs Improved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Text Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Original Text (Candidate Input)
            </h3>
            <span className="text-[11px] text-slate-500">Edit or paste directly</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            placeholder="Type or paste a resume bullet point..."
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-blue-500 transition resize-y"
          />

          <button
            onClick={handleImproveRequest}
            disabled={loading || !inputText.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Refining with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Optimized Version <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right: AI Output & Rationale */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Revised Accomplishment
            </h3>
            {improvedResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {improvedResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed font-medium">
                {improvedResult.improvedText}
              </div>

              {/* Added Keywords */}
              {improvedResult.keywordsAdded && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    ATS Keywords Incorporated:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {improvedResult.keywordsAdded.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium"
                      >
                        +{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* What changed list */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Editorial Enhancements:
                </span>
                <ul className="space-y-1.5">
                  {improvedResult.keyChanges.map((change, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recruiter Rationale */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200 block mb-0.5">Recruiter Perspective:</strong>
                {improvedResult.recruiterRationale}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Click &quot;Generate Optimized Version&quot; to review AI suggestions.
            </div>
          )}
        </div>
      </div>

      {/* Anti-Hallucination Ethics Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block">Strict Anti-Hallucination Policy:</strong>
          SkillMatch AI refines phrasing, clarifies impact, and elevates technical clarity, but will never invent fictitious metrics, employers, or credentials. Always replace metric brackets like <code className="text-blue-300 font-mono">[X%]</code> with your authentic verified achievements.
        </div>
      </div>
    </div>
  );
};
