import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  ShieldCheck,
  Sparkles,
  Database,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  UserX,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    systemStatus,
    user,
    activeProfile,
    savedJobs,
    applications,
    learningRoadmap,
    clearAllUserData,
  } = useApp();

  const [checkingApi, setCheckingApi] = useState(false);
  const [apiPingResult, setApiPingResult] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleTestApi = async () => {
    setCheckingApi(true);
    setApiPingResult(null);

    try {
      const res = await fetch('/api/system/status');
      const data = await res.json();
      setApiPingResult(
        `Server Status: ${data.status.toUpperCase()} • Gemini Model: ${data.model} • Key Injected: ${
          data.hasGeminiKey ? 'YES (Active)' : 'NO (Using Rule-Based Fallback)'
        }`
      );
    } catch {
      setApiPingResult('Connection to /api/system/status failed.');
    } finally {
      setCheckingApi(false);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      user,
      activeProfile,
      savedJobs,
      applications,
      learningRoadmap,
      exportedAt: new Date().toISOString(),
      platform: 'SkillMatch AI — Smart Career Navigator',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillMatchAI_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Privacy Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Settings & Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Review Gemini AI connectivity, manage local persistence, and purge or export candidate data.
        </p>
      </div>

      {/* Gemini AI Backend Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Google Gemini API Integration
          </h2>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
              systemStatus.hasGeminiKey
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {systemStatus.hasGeminiKey ? 'Gemini 3.8 Flash Active' : 'Demo Fallback Active'}
          </span>
        </div>

        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>Server-Side Proxy Architecture:</strong> In compliance with security standards, all Gemini API calls occur strictly within the backend server (<code className="text-blue-300 font-mono">server.ts</code>). API keys are never exposed in browser bundles or client-side storage.
          </p>
          <p className="text-slate-400">
            When a Gemini API key is configured via Google AI Studio secrets, the app utilizes <strong className="text-white">gemini-3.8-flash</strong>. If credentials are not attached, the application automatically employs our high-fidelity deterministic semantic parsing engine so all features remain functional.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={handleTestApi}
            disabled={checkingApi}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
          >
            {checkingApi ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            )}
            Ping Backend Health Endpoint
          </button>

          {apiPingResult && (
            <span className="text-xs font-mono text-emerald-400">{apiPingResult}</span>
          )}
        </div>
      </div>

      {/* Data Persistence & Export */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-violet-400" />
          Data Persistence & Portability
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your saved jobs, application tracking pipeline, customized resume text, and learning roadmap are persistently maintained across browser sessions. You can download an offline archive of all records at any time.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" /> Export Complete Data Archive (JSON)
          </button>
        </div>
      </div>

      {/* Ethical AI and Transparency */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Ethical AI & Data Privacy Commitments
        </h2>
        <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-slate-300">No Model Training:</strong> Your uploaded resume documents are never used to train or fine-tune public foundation AI models.
          </li>
          <li>
            <strong className="text-slate-300">Bias-Free Scoring:</strong> Compatibility calculations rely exclusively on verified engineering technical skills, project evidence, and documented tenure. Protected characteristics (gender, ethnicity, religion, or age) are strictly excluded from matching algorithms.
          </li>
          <li>
            <strong className="text-slate-300">Minimal Payload Transfer:</strong> Only the extracted textual content required for skills matching is transmitted to the AI endpoint; unnecessary metadata is stripped.
          </li>
        </ul>
      </div>

      {/* Danger Zone: Data Purge & Account Deletion */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-4">
        <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone: Data Deletion
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          Permanently delete your uploaded resume, parsed skill records, application tracking pipeline, and saved jobs from this browser session.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear All Candidate Data
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 space-y-3">
            <p className="text-xs text-red-200 font-bold">
              Are you sure? This will delete all your active records and reset your session.
            </p>
            <div className="flex gap-2">
              <button
                onClick={clearAllUserData}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition"
              >
                Yes, Permanently Purge Everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
