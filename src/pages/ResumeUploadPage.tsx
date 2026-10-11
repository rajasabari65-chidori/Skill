import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileCheck,
  RefreshCw,
  X,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { parseDocument } from '../utils/documentParser';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

export const ResumeUploadPage: React.FC = () => {
  const {
    rawResumeText,
    setRawResumeText,
    setActiveProfile,
    setCurrentRoute,
    loadSampleProfile,
    user,
    setUser,
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);
    setWarningMessage(null);
    setParsing(true);
    setParseProgress(20);

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    try {
      setParseProgress(50);
      const result = await parseDocument(file);
      setParseProgress(90);

      setRawResumeText(result.text);

      if (result.warnings && result.warnings.length > 0) {
        setWarningMessage(result.warnings.join(' '));
      }

      setParseProgress(100);
      setTimeout(() => setParsing(false), 300);
    } catch (err: unknown) {
      setParsing(false);
      const msg = err instanceof Error ? err.message : 'Failed to extract text from document.';
      setErrorMessage(msg);
    }
  };

  const triggerGeminiAnalysis = async () => {
    if (!rawResumeText.trim() || rawResumeText.trim().length < 30) {
      setErrorMessage('Please upload a resume or paste text with at least 30 characters before analyzing.');
      return;
    }

    setAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: rawResumeText,
          targetRole: user?.preferences?.preferredRoles?.[0] || 'Software Engineer',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server resume analysis failed.');
      }

      if (data.profile) {
        setActiveProfile(data.profile);
        if (user) {
          setUser({
            ...user,
            displayName: data.profile.fullName || user.displayName,
            headline: data.profile.title || user.headline,
            yearsOfExperience: data.profile.yearsOfExperience || user.yearsOfExperience,
            confirmedSkills: data.profile.skills.map((s: { name: string }) => s.name),
          });
        }
        setCurrentRoute('resume-analysis');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis error. Please try again.';
      setErrorMessage(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearResume = () => {
    setFileName(null);
    setFileSize(null);
    setRawResumeText('');
    setErrorMessage(null);
    setWarningMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Upload className="w-3.5 h-3.5" />
          <span>Step 1: Document Parsing & Text Review</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Upload Your Resume</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Upload your PDF or Word DOCX resume. All document extraction is securely validated before semantic AI analysis.
        </p>
      </div>

      {/* 1-Click Sample Resumes Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">Test with Pre-Configured Sample Resumes</span>
          <p className="text-[11px] text-slate-400">Load authentic technical resumes instantly with 1-click to test the matching pipeline:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROFILES.map((p, idx) => (
            <button
              key={p.label}
              onClick={() => {
                loadSampleProfile(idx);
                setFileName(`${p.role.replace(/\s+/g, '_')}_Sample.pdf`);
                setFileSize('48.2 KB');
                setErrorMessage(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-700 text-slate-200 text-xs font-medium transition"
            >
              {p.role}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
          id="resume-file-input"
        />

        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-white">Drag and drop your resume file here</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Supports <strong className="text-slate-200">PDF (.pdf)</strong> and <strong className="text-slate-200">Microsoft Word (.docx)</strong> up to 8MB in size.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <label
            htmlFor="resume-file-input"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 cursor-pointer transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Browse Files on Device
          </label>
        </div>

        {/* Parsing Progress Indicator */}
        {parsing && (
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Extracting text layers...</span>
              <span>{parseProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${parseProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Warnings & Errors */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold">{errorMessage}</p>
          </div>
        </div>
      )}

      {warningMessage && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
          <div className="flex-1">
            <p className="font-semibold">Notice regarding extracted document:</p>
            <p className="mt-0.5 text-amber-200">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Extracted Text Review & Edit Area */}
      {rawResumeText && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Text Extraction Successful
              </span>
              <h3 className="text-base font-bold text-white mt-1">Review & Edit Resume Text</h3>
              <p className="text-xs text-slate-400">
                You can directly edit or add missing bullet points below prior to AI semantic analysis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {fileName && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {fileName} ({fileSize})
                </span>
              )}
              <button
                onClick={handleClearResume}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            value={rawResumeText}
            onChange={(e) => setRawResumeText(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 transition resize-y"
            placeholder="Paste your raw resume text here..."
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{rawResumeText.trim().split(/\s+/).length} words ready for Google Gemini analysis</span>
            </div>

            <button
              onClick={triggerGeminiAnalysis}
              disabled={analyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Proceed to AI Resume Analysis <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
