import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  FolderGit2,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ExtractedSkill } from '../types';

export const ResumeAnalysisPage: React.FC = () => {
  const { activeProfile, setActiveProfile, setCurrentRoute } = useApp();

  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState(activeProfile?.summary || '');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<ExtractedSkill['category']>('Programming');

  if (!activeProfile) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-4">
        <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Resume Analyzed Yet</h2>
        <p className="text-xs text-slate-400">
          Upload a resume or select a sample candidate profile to run the AI analysis.
        </p>
        <button
          onClick={() => setCurrentRoute('upload-resume')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Go to Resume Upload
        </button>
      </div>
    );
  }

  const handleSaveSummary = () => {
    setActiveProfile({
      ...activeProfile,
      summary: editedSummary,
    });
    setIsEditingSummary(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const exists = activeProfile.skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) return;

    const updatedSkills: ExtractedSkill[] = [
      ...activeProfile.skills,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        evidence: 'Manually confirmed and added by candidate.',
        confidence: 'high',
      },
    ];

    setActiveProfile({
      ...activeProfile,
      skills: updatedSkills,
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setActiveProfile({
      ...activeProfile,
      skills: activeProfile.skills.filter((s) => s.name !== skillName),
    });
  };

  // Group skills by category
  const skillsByCategory = activeProfile.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, ExtractedSkill[]>);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2: Semantic Profile & Skill Extraction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Resume Analysis: {activeProfile.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {activeProfile.title} • {activeProfile.yearsOfExperience} years verified experience
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentRoute('job-recommendations')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
          >
            Find Matching Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Roles Pill Bar */}
      {activeProfile.suggestedRoles && activeProfile.suggestedRoles.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-400" />
            AI-Suggested Target Career Tracks:
          </span>
          <div className="flex flex-wrap gap-2">
            {activeProfile.suggestedRoles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/25 text-xs font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Professional Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            Professional Profile Summary
          </h2>
          {!isEditingSummary ? (
            <button
              onClick={() => {
                setEditedSummary(activeProfile.summary);
                setIsEditingSummary(true);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Summary
            </button>
          ) : (
            <button
              onClick={handleSaveSummary}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          )}
        </div>

        {!isEditingSummary ? (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeProfile.summary}
          </p>
        ) : (
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Categorized Skills Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              Categorized Skills & Evidence Breakdown
            </h2>
            <p className="text-xs text-slate-400">
              Each skill is linked to factual evidence extracted from your resume.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {activeProfile.skills.length} skills identified
          </span>
        </div>

        {/* Add Skill Bar */}
        <form onSubmit={handleAddSkill} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add unlisted skill (e.g. Docker, GraphQL, PyTorch)..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="Programming">Programming</option>
            <option value="Frameworks & Libraries">Frameworks & Libraries</option>
            <option value="Databases & Cloud">Databases & Cloud</option>
            <option value="Tools & DevOps">Tools & DevOps</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Domain Expertise">Domain Expertise</option>
          </select>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </form>

        {/* Skills Cards Grid by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{category}</h3>
                <span className="text-[11px] text-slate-400 font-semibold">{skills.length}</span>
              </div>

              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{skill.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold capitalize ${
                            skill.confidence === 'high'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {skill.confidence} confidence
                        </span>
                      </div>
                      {skill.evidence && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                          &quot;{skill.evidence}&quot;
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveSkill(skill.name)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Key Candidate Strengths
          </h3>
          <ul className="space-y-2.5">
            {activeProfile.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" />
            Actionable Resume Improvements
          </h3>
          <ul className="space-y-2.5">
            {activeProfile.improvements.map((imp, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Experience & Projects Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Extracted Work Experience
          </h3>
          <div className="space-y-4">
            {activeProfile.experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{exp.title}</h4>
                  <span className="text-[10px] text-slate-400">{exp.duration}</span>
                </div>
                <p className="text-[11px] text-blue-400 font-medium">{exp.company} • {exp.location}</p>
                <p className="text-xs text-slate-300 pt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <FolderGit2 className="w-4 h-4 text-violet-400" />
            Key Projects
          </h3>
          <div className="space-y-4">
            {activeProfile.projects.map((proj, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                <div className="flex flex-wrap gap-1 py-1">
                  {proj.technologies.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-300">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
