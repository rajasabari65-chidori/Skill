/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage';
import { JobRecommendationsPage } from './pages/JobRecommendationsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { SkillGapAnalysisPage } from './pages/SkillGapAnalysisPage';
import { ResumeImprovementStudioPage } from './pages/ResumeImprovementStudioPage';
import { CareerAssistantPage } from './pages/CareerAssistantPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { CareerAnalyticsPage } from './pages/CareerAnalyticsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Standalone pages without dashboard chrome
  if (currentRoute === 'landing') {
    return <LandingPage />;
  }

  if (
    currentRoute === 'login' ||
    currentRoute === 'signup' ||
    currentRoute === 'forgot-password' ||
    currentRoute === 'onboarding'
  ) {
    return <AuthPages mode={currentRoute} />;
  }

  // Dashboard layout for logged-in / demo session pages
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-row antialiased selection:bg-blue-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
        />

        <main className="flex-1 overflow-y-auto">
          {currentRoute === 'dashboard' && <DashboardPage />}
          {currentRoute === 'upload-resume' && <ResumeUploadPage />}
          {currentRoute === 'resume-analysis' && <ResumeAnalysisPage />}
          {currentRoute === 'job-recommendations' && <JobRecommendationsPage />}
          {currentRoute === 'job-details' && <JobDetailsPage />}
          {currentRoute === 'skill-gap' && <SkillGapAnalysisPage />}
          {currentRoute === 'resume-improvement' && <ResumeImprovementStudioPage />}
          {currentRoute === 'career-assistant' && <CareerAssistantPage />}
          {currentRoute === 'learning-roadmap' && <LearningRoadmapPage />}
          {currentRoute === 'saved-jobs' && <SavedJobsPage />}
          {currentRoute === 'application-tracker' && <ApplicationTrackerPage />}
          {currentRoute === 'career-analytics' && <CareerAnalyticsPage />}
          {currentRoute === 'profile' && <UserProfilePage />}
          {currentRoute === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
