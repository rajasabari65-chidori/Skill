import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Check,
  Plus,
  X,
  Sparkles,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { WorkMode } from '../types';

export const UserProfilePage: React.FC = () => {
  const { user, setUser, activeProfile, setActiveProfile } = useApp();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Chen');
  const [headline, setHeadline] = useState(user?.headline || 'Full-Stack Software Engineer');
  const [email, setEmail] = useState(user?.email || 'alex.chen@example.com');
  const [location, setLocation] = useState(user?.location || 'San Francisco, CA');
  const [yearsExp, setYearsExp] = useState(user?.yearsOfExperience || 2.5);
  const [degree, setDegree] = useState(user?.degree || 'Bachelor of Science');
  const [specialization, setSpecialization] = useState(user?.specialization || 'Computer Science');
  const [gradYear, setGradYear] = useState(user?.graduationYear || 2023);
  const [targetSalary, setTargetSalary] = useState(user?.preferences?.targetSalaryMin || 110000);
  const [relocation, setRelocation] = useState(user?.preferences?.openToRelocation ?? true);

  const [skills, setSkills] = useState<string[]>(
    user?.confirmedSkills || activeProfile?.skills.map((s) => s.name) || []
  );
  const [newSkill, setNewSkill] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        displayName,
        headline,
        email,
        location,
        yearsOfExperience: Number(yearsExp),
        degree,
        specialization,
        graduationYear: Number(gradYear),
        confirmedSkills: skills,
        preferences: {
          ...user.preferences,
          targetSalaryMin: Number(targetSalary),
          openToRelocation: relocation,
        },
      });
    }

    if (activeProfile) {
      setActiveProfile({
        ...activeProfile,
        fullName: displayName,
        title: headline,
        yearsOfExperience: Number(yearsExp),
      });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Candidate Profile</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Confirmed preferences, credentials, and validated technical skills.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> Changes Saved Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" /> Professional Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Headline / Target Title</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-violet-400" /> Education & Experience Tenure
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization / Major</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="40"
                value={yearsExp}
                onChange={(e) => setYearsExp(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Confirmed Skills Management */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Confirmed Skills
            </h2>
            <span className="text-xs text-slate-400">{skills.length} skills indexed</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-500 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add confirmed skill..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Target Compensation & Mobility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Minimum Salary ($)</label>
              <input
                type="number"
                step="5000"
                value={targetSalary}
                onChange={(e) => setTargetSalary(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="relocation"
                checked={relocation}
                onChange={(e) => setRelocation(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 accent-blue-600"
              />
              <label htmlFor="relocation" className="text-xs text-slate-300 cursor-pointer">
                Open to relocation for qualified opportunities
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-blue-500/20 transition"
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
};
