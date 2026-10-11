import React from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  Briefcase,
  Target,
  Sparkles,
  MessageSquare,
  Compass,
  Bookmark,
  Kanban,
  BarChart3,
  UserCheck,
  Settings,
  Compass as CompassIcon,
  Home,
  CheckCircle,
  Users,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../../data/sampleProfiles';

interface NavItem {
  id: AppRoute;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{
  isCollapsed: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}> = ({ isCollapsed, isOpenMobile, onCloseMobile }) => {
  const {
    currentRoute,
    setCurrentRoute,
    savedJobs,
    applications,
    loadSampleProfile,
    activeProfile,
  } = useApp();

  const navigationGroups: NavGroup[] = [
    {
      groupName: 'Core Navigation',
      items: [
        { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
        { id: 'upload-resume', label: 'Resume Upload', icon: Upload },
        { id: 'resume-analysis', label: 'Resume Analysis', icon: FileSearch },
      ],
    },
    {
      groupName: 'Job Discovery & Fit',
      items: [
        { id: 'job-recommendations', label: 'Job Matches', icon: Briefcase, badge: '24' },
        { id: 'job-details', label: 'Job Comparison', icon: CheckCircle },
        { id: 'skill-gap', label: 'Skill Gap Analysis', icon: Target },
      ],
    },
    {
      groupName: 'AI Career Studio',
      items: [
        { id: 'resume-improvement', label: 'Improvement Studio', icon: Sparkles },
        { id: 'career-assistant', label: 'AI Career Assistant', icon: MessageSquare, badge: 'AI' },
        { id: 'learning-roadmap', label: 'Learning Roadmap', icon: Compass },
      ],
    },
    {
      groupName: 'Pipeline & Progress',
      items: [
        {
          id: 'saved-jobs',
          label: 'Saved Jobs',
          icon: Bookmark,
          badge: savedJobs.length > 0 ? String(savedJobs.length) : undefined,
        },
        {
          id: 'application-tracker',
          label: 'Application Tracker',
          icon: Kanban,
          badge: applications.length > 0 ? String(applications.length) : undefined,
        },
        { id: 'career-analytics', label: 'Career Analytics', icon: BarChart3 },
      ],
    },
    {
      groupName: 'Account & Settings',
      items: [
        { id: 'profile', label: 'User Profile', icon: UserCheck },
        { id: 'onboarding', label: 'Career Goals', icon: CompassIcon },
        { id: 'settings', label: 'Settings & Privacy', icon: Settings },
        { id: 'landing', label: 'Landing Page', icon: Home },
      ],
    },
  ];

  const handleNavClick = (route: AppRoute) => {
    setCurrentRoute(route);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div
            onClick={() => setCurrentRoute('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  SkillMatch <span className="text-blue-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 tracking-wider uppercase font-semibold">
                  Smart Career Navigator
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navigationGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {group.groupName}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer: Demo Profile Switcher */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Active Persona
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">1-Click Test</span>
            </div>
            <select
              value={
                activeProfile?.fullName === 'Samantha Rao'
                  ? 1
                  : activeProfile?.fullName === 'Marcus Vance'
                  ? 2
                  : activeProfile?.fullName === 'Elena Rostova'
                  ? 3
                  : 0
              }
              onChange={(e) => loadSampleProfile(Number(e.target.value))}
              aria-label="Select demo profile persona"
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-slate-300 focus:outline-none focus:border-blue-500"
            >
              {SAMPLE_PROFILES.map((p, idx) => (
                <option key={p.label} value={idx}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => loadSampleProfile(0)}
              title="Reset Demo Candidate"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
