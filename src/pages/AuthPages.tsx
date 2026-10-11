import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  MapPin,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const AuthPages: React.FC<{ mode: 'login' | 'signup' | 'forgot-password' | 'onboarding' }> = ({ mode }) => {
  const { setCurrentRoute, setUser, loginAsDemo, user } = useApp();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Onboarding states
  const [degree, setDegree] = useState(user?.degree || 'Bachelor of Science');
  const [specialization, setSpecialization] = useState(user?.specialization || 'Computer Science');
  const [yearsExp, setYearsExp] = useState(user?.yearsOfExperience || 2);
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [workMode, setWorkMode] = useState<'remote' | 'hybrid' | 'on-site'>('remote');
  const [locationPref, setLocationPref] = useState('San Francisco, CA');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // In demo environment, log user in
    setUser({
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      headline: 'Software Engineer',
      yearsOfExperience: 2,
      confirmedSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'Git'],
      preferences: {
        preferredRoles: ['Full-Stack Developer', 'Frontend Developer'],
        preferredLocations: ['Remote', 'San Francisco, CA'],
        preferredWorkMode: ['remote', 'hybrid'],
        preferredEmploymentType: ['full-time'],
        openToRelocation: true,
      },
      isDemoUser: false,
      createdAt: new Date().toISOString(),
    });

    setCurrentRoute('dashboard');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for security.');
      return;
    }

    setUser({
      uid: `user-${Date.now()}`,
      email,
      displayName: name,
      headline: 'Candidate Profile',
      yearsOfExperience: 1,
      confirmedSkills: ['Git', 'Problem Solving'],
      preferences: {
        preferredRoles: ['Software Developer'],
        preferredLocations: ['Remote'],
        preferredWorkMode: ['remote'],
        preferredEmploymentType: ['full-time'],
        openToRelocation: true,
      },
      isDemoUser: false,
      createdAt: new Date().toISOString(),
    });

    setCurrentRoute('onboarding');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setSuccessMsg(`A password reset link has been dispatched to ${email}. (Simulated)`);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        degree,
        specialization,
        yearsOfExperience: Number(yearsExp),
        preferences: {
          ...user.preferences,
          preferredRoles: [targetRole],
          preferredLocations: [locationPref],
          preferredWorkMode: [workMode],
        },
      });
    }
    setCurrentRoute('upload-resume');
  };

  if (mode === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 1 of 2</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Configure Your Career Goals</h2>
            <p className="text-xs text-slate-400 mt-1">Help our AI matching engine pinpoint the most relevant job vacancies.</p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role Category</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Developer, Data Scientist"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Highest Degree</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.S., M.S., Bootcamp"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization / Major</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Computer Science, Statistics"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.5"
                  value={yearsExp}
                  onChange={(e) => setYearsExp(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={locationPref}
                    onChange={(e) => setLocationPref(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Work Mode Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {(['remote', 'hybrid', 'on-site'] as const).map((modeOption) => (
                  <button
                    key={modeOption}
                    type="button"
                    onClick={() => setWorkMode(modeOption)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition ${
                      workMode === modeOption
                        ? 'bg-blue-600 border-blue-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {modeOption}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              Save & Proceed to Resume Upload <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' && 'Sign In to SkillMatch AI'}
            {mode === 'signup' && 'Create Your Candidate Account'}
            {mode === 'forgot-password' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Access your resume analyses and job match scores.'}
            {mode === 'signup' && 'Start matching your skills with 24+ simulated engineering jobs.'}
            {mode === 'forgot-password' && 'Enter your registered email to receive recovery instructions.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            {successMsg}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentRoute('forgot-password')}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition"
            >
              Sign In
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition"
            >
              Create Account
            </button>
          </form>
        )}

        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition"
            >
              Send Password Reset Link
            </button>

            <button
              type="button"
              onClick={() => setCurrentRoute('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* Demo Fast Bypass Divider */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-3">Or explore without credentials:</p>
          <button
            onClick={loginAsDemo}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Continue as Demo Candidate (Alex Chen)
          </button>
        </div>

        {/* Mode switcher link */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setCurrentRoute('signup')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setCurrentRoute('login')}
                className="text-blue-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
