import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Bell,
  Search,
  User,
  Menu,
  ChevronDown,
  ShieldCheck,
  Zap,
  CheckCircle,
  LogOut,
  Sliders,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Navbar: React.FC<{
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}> = ({ onToggleSidebar }) => {
  const {
    currentRoute,
    setCurrentRoute,
    user,
    systemStatus,
    notifications,
    logout,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentRoute('job-recommendations');
    }
  };

  const pageTitles: Record<string, string> = {
    landing: 'Home',
    dashboard: 'Main Dashboard',
    'upload-resume': 'Upload & Parse Resume',
    'resume-analysis': 'AI Resume Analysis',
    'job-recommendations': 'Matching Job Opportunities',
    'job-details': 'Job Match Deep-Dive',
    'skill-gap': 'Skill Gap Analysis & Plan',
    'resume-improvement': 'Resume Improvement Studio',
    'career-assistant': 'AI Career Assistant',
    'learning-roadmap': 'Personalized Learning Roadmap',
    'saved-jobs': 'Saved Jobs Catalog',
    'application-tracker': 'Application Tracker & Pipeline',
    'career-analytics': 'Career Analytics & Metrics',
    profile: 'Candidate Profile',
    settings: 'Settings & Privacy Controls',
    onboarding: 'Career Preferences Onboarding',
    signup: 'Create Account',
    login: 'Sign In',
    'forgot-password': 'Password Recovery',
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
      {/* Left: Hamburger & Current page */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            SkillMatch AI
          </span>
          <span className="text-slate-600">/</span>
          <h1 className="text-sm font-semibold text-slate-100">
            {pageTitles[currentRoute] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified simulated jobs, required skills..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/40 transition"
          />
        </form>
      </div>

      {/* Right: Gemini status, Notifications, User menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Gemini Engine Status Badge */}
        <div
          title={
            systemStatus.hasGeminiKey
              ? 'Gemini 3.8 Flash Active via Server-side Proxy'
              : 'Demo AI Mode (Rule-Based Semantic Fallback)'
          }
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            systemStatus.hasGeminiKey
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {systemStatus.hasGeminiKey ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini 3.8 Flash</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Demo Engine</span>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>
          <NotificationCenter
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 transition text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.displayName || 'Guest Demo'}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {user?.isDemoUser ? 'Demo Candidate' : 'Verified User'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 text-xs backdrop-blur-xl">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="font-semibold text-slate-200">{user?.displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                {user?.isDemoUser && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Simulated Demo Session
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setCurrentRoute('profile');
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 transition"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                View & Edit Profile
              </button>

              <button
                onClick={() => {
                  setCurrentRoute('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 transition"
              >
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                Settings & Privacy
              </button>

              <button
                onClick={() => {
                  setCurrentRoute('upload-resume');
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 transition"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Upload New Resume
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-950/20 flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                Exit / Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
