import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Target,
  Compass,
  Zap,
  TrendingUp,
  Brain,
  Users,
  Award,
  ChevronRight,
  Building,
  Briefcase,
  Star,
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, loginAsDemo, loadSampleProfile } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Banner: Demo Mode Indicator */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-violet-900/60 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-200">
        <span className="font-semibold text-white">🚀 SkillMatch AI Ready</span> — Complete end-to-end resume skill matching, deterministic scoring, and Google Gemini AI integration.
        <button
          onClick={loginAsDemo}
          className="ml-3 underline hover:text-white font-bold transition inline-flex items-center gap-1"
        >
          Launch Instant Demo <ArrowRight className="w-3 h-3 inline" />
        </button>
      </div>

      {/* Main Landing Navigation */}
      <header className="border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                SkillMatch <span className="text-blue-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5 tracking-wider uppercase font-semibold">
                Smart Career Navigator
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-blue-400 transition">How It Works</a>
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#match-engine" className="hover:text-blue-400 transition">Scoring Engine</a>
            <a href="#privacy" className="hover:text-blue-400 transition">Privacy & Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentRoute('login')}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition"
            >
              Sign In
            </button>
            <button
              onClick={loginAsDemo}
              className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition transform active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Try Live Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Discover Your Skills. Match Your Career. Build Your Future.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Turn Your Resume Into a <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">Competitive Advantage</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, unlock transparent 5-factor job compatibility scoring, pinpoint skill gaps, and accelerate your career with Google Gemini AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                loginAsDemo();
                setCurrentRoute('upload-resume');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Upload & Analyze Resume
            </button>

            <button
              onClick={loginAsDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-blue-400" />
              Explore Sample Candidate
            </button>
          </div>

          {/* Persona quick switch strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-400">Or test ready profiles:</span>
            {SAMPLE_PROFILES.map((p, idx) => (
              <button
                key={p.label}
                onClick={() => {
                  loadSampleProfile(idx);
                  loginAsDemo();
                }}
                className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-white transition flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {p.role}
              </button>
            ))}
          </div>

          {/* Interactive Hero Card Preview */}
          <div className="mt-14 max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Live Match Simulation
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Full-Stack Developer (MERN / Next.js)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  NovaSphere Interactive (Simulated) • Chicago, IL (Hybrid) • $85k - $105k
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">88%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Match Score</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Match breakdown bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Required Skills (50%)</span>
                <div className="text-sm font-bold text-emerald-400">86% Coverage</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '86%' }} />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">Preferred Skills (20%)</span>
                <div className="text-sm font-bold text-blue-400">80% Coverage</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">Experience Alignment (15%)</span>
                <div className="text-sm font-bold text-violet-400">100% Fit</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-violet-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1">Education Fit (10%)</span>
                <div className="text-sm font-bold text-white">100% Fit</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Matched & Missing Chips */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Matched:</span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">React</span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Node.js</span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">JavaScript</span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">REST API</span>
                <span className="text-xs font-semibold text-slate-400 ml-2">Missing:</span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Next.js (Preferred)</span>
              </div>
              <button
                onClick={loginAsDemo}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                Inspect in Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Clear 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How SkillMatch AI Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              From raw document parsing to verified career roadmaps, every step is explainable, private, and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative group hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm mb-4 border border-blue-500/20">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag and drop PDF or DOCX files. Client-side extraction preserves formatting without sending raw unapproved data.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-500/20">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Gemini extracts verified skills, evidence snippets, confidence levels, and categorized project experience.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative group hover:border-violet-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center font-bold text-sm mb-4 border border-violet-500/20">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">5-Factor Scoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic matching engine calculates compatibility across Required (50%), Preferred (20%), Experience (15%), and Education (10%).
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative group hover:border-emerald-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-500/20">
                04
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bridge the Gaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive prioritized practice tasks, portfolio mini-projects, resume bullet refinements, and track applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Match Engine Section */}
      <section id="match-engine" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Deterministic & Explainable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                No Black-Box Scoring. Just Clear Compatibility.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                Unlike vague ATS platforms that assign mysterious scores, SkillMatch AI uses a strictly mathematical, reproducible 5-factor model that distinguishes confirmed skills from missing requirements.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">50% Required Skills</h4>
                    <p className="text-xs text-slate-400">Must-have qualifications explicitly required by the engineering team.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">20% Preferred Qualifications</h4>
                    <p className="text-xs text-slate-400">Differentiating skills that boost interview callback rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">15% Verified Experience</h4>
                    <p className="text-xs text-slate-400">Pro-rated calculation based on verified tenure and project depth.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">10% Education & 5% Role Fit</h4>
                    <p className="text-xs text-slate-400">Degree alignment and past title domain overlap.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Scoring Engine Formula</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  v1.4 Spec
                </span>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-slate-950 font-mono text-xs text-blue-300 leading-relaxed border border-slate-800">
                Overall Match Score = <br />
                &nbsp;&nbsp;(ReqCoverage × 0.50) + <br />
                &nbsp;&nbsp;(PrefCoverage × 0.20) + <br />
                &nbsp;&nbsp;(ExpAlignment × 0.15) + <br />
                &nbsp;&nbsp;(EduAlignment × 0.10) + <br />
                &nbsp;&nbsp;(RoleRelevance × 0.05)
              </div>
              <div className="mt-4 text-xs text-slate-400 leading-relaxed">
                Weights are dynamically normalized if a job does not specify a preferred skill requirement. Unconfirmed skills are categorized as &quot;Needs Verification&quot; rather than penalizing candidate scores silently.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-20 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Built for Outcomes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything You Need to Land Your Next Role
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Resume Improvement Studio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Refine bullet points with active verbs and quantifiable metrics. Compare original vs improved versions side-by-side with anti-hallucination guardrails.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Actionable Skill Gap Maps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never guess why you were rejected. Inspect why each skill is required, the estimated study duration, and suggested portfolio mini-projects.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Full Application Kanban</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track your active job applications across 7 stages: Interested, Applied, Assessment, Interview, Offer, Rejected, and Withdrawn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Security Section */}
      <section id="privacy" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Privacy & Ethical Standards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
            Your Resume Stays Yours. Period.
          </h2>

          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            We never train AI models on candidate resumes. No PII is logged on servers, and you can delete all uploaded data and analysis history at any time with one click.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold text-white mb-1">Zero Sensitive Bias</h4>
              <p className="text-[11px] text-slate-400">Gender, age, religion, or location are never factored into match scoring algorithms.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold text-white mb-1">Secure Server Proxy</h4>
              <p className="text-[11px] text-slate-400">Gemini API credentials never touch browser bundles. All requests run through a secure backend proxy.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-bold text-white mb-1">Complete Data Deletion</h4>
              <p className="text-[11px] text-slate-400">Purge local candidate files and analytical state with instant reset controls in Settings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">SkillMatch AI</span>
              <span className="text-[10px] text-slate-500">Smart Career Navigator © 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button onClick={() => setCurrentRoute('settings')} className="hover:text-white transition">Privacy Controls</button>
            <button onClick={() => setCurrentRoute('job-recommendations')} className="hover:text-white transition">Job Directory</button>
            <button onClick={() => setCurrentRoute('upload-resume')} className="hover:text-white transition">Upload Resume</button>
            <button onClick={loginAsDemo} className="text-blue-400 hover:text-blue-300 font-semibold transition">Demo Mode</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
