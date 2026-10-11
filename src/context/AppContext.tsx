import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  ExtractedProfile,
  JobListing,
  ApplicationRecord,
  SavedJobRecord,
  LearningRoadmap,
  ChatMessage,
  NotificationItem,
  ApplicationStatus,
} from '../types';
import { SIMULATED_JOBS } from '../data/mockJobs';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

export type AppRoute =
  | 'landing'
  | 'signup'
  | 'login'
  | 'forgot-password'
  | 'onboarding'
  | 'dashboard'
  | 'upload-resume'
  | 'resume-analysis'
  | 'job-recommendations'
  | 'job-details'
  | 'skill-gap'
  | 'resume-improvement'
  | 'career-assistant'
  | 'learning-roadmap'
  | 'saved-jobs'
  | 'application-tracker'
  | 'career-analytics'
  | 'profile'
  | 'settings';

interface SystemStatus {
  hasGeminiKey: boolean;
  status: string;
  model: string;
}

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  activeProfile: ExtractedProfile | null;
  setActiveProfile: React.Dispatch<React.SetStateAction<ExtractedProfile | null>>;
  rawResumeText: string;
  setRawResumeText: (text: string) => void;
  jobs: JobListing[];
  savedJobs: SavedJobRecord[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  applications: ApplicationRecord[];
  addApplication: (job: JobListing, notes?: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  deleteApplication: (id: string) => void;
  learningRoadmap: LearningRoadmap | null;
  setLearningRoadmap: React.Dispatch<React.SetStateAction<LearningRoadmap | null>>;
  toggleMilestone: (milestoneId: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  loadSampleProfile: (index?: number) => void;
  systemStatus: SystemStatus;
  loginAsDemo: () => void;
  logout: () => void;
  clearAllUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_DEMO_USER: UserProfile = {
  uid: 'demo-user-001',
  email: 'alex.chen.demo@skillmatch.ai',
  displayName: 'Alex Chen',
  headline: 'Full-Stack Software Engineer & Cloud Enthusiast',
  bio: 'Passionate about building resilient web applications, developer ergonomics, and microservice architectures.',
  location: 'San Francisco, CA',
  yearsOfExperience: 2.5,
  graduationYear: 2023,
  degree: 'Bachelor of Science',
  specialization: 'Computer Science',
  confirmedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'REST API', 'SQL'],
  preferences: {
    preferredRoles: ['Full-Stack Developer', 'Frontend Developer', 'Software Developer'],
    preferredLocations: ['San Francisco, CA', 'Austin, TX', 'Remote'],
    preferredWorkMode: ['remote', 'hybrid'],
    preferredEmploymentType: ['full-time'],
    targetSalaryMin: 110000,
    openToRelocation: true,
  },
  isDemoUser: true,
  createdAt: '2026-10-01T12:00:00Z',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('job-fs-06');

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });

  // Resume & Extracted profile
  const [activeProfile, setActiveProfile] = useState<ExtractedProfile | null>(() => {
    const saved = localStorage.getItem('sm_active_profile');
    return saved ? JSON.parse(saved) : SAMPLE_PROFILES[0].profile;
  });

  const [rawResumeText, setRawResumeText] = useState<string>(() => {
    const saved = localStorage.getItem('sm_raw_resume');
    return saved || SAMPLE_PROFILES[0].rawResume;
  });

  // Saved Jobs
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>(() => {
    const saved = localStorage.getItem('sm_saved_jobs');
    return saved
      ? JSON.parse(saved)
      : [
          { jobId: 'job-fs-06', savedAt: '2026-10-10T14:20:00Z' },
          { jobId: 'job-swe-01', savedAt: '2026-10-09T09:15:00Z' },
        ];
  });

  // Applications
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('sm_applications');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'app-01',
            jobId: 'job-fs-06',
            jobTitle: 'Full-Stack Developer (MERN / Next.js)',
            company: 'NovaSphere Interactive (Simulated)',
            location: 'Chicago, IL (Hybrid)',
            status: 'Applied',
            appliedDate: '2026-10-10',
            lastUpdated: '2026-10-10',
            notes: 'Submitted customized resume highlighting React microservice experience.',
            matchScoreAtApply: 88,
          },
          {
            id: 'app-02',
            jobId: 'job-fe-04',
            jobTitle: 'Frontend Developer (React / TypeScript)',
            company: 'Pulse UI Labs (Simulated)',
            location: 'Seattle, WA (Remote)',
            status: 'Interview',
            appliedDate: '2026-10-05',
            lastUpdated: '2026-10-09',
            notes: 'Completed hiring manager screening. Scheduled technical design round.',
            matchScoreAtApply: 92,
            interviewDate: '2026-10-16T15:00:00Z',
          },
          {
            id: 'app-03',
            jobId: 'job-swe-01',
            jobTitle: 'Software Developer (Core Platform)',
            company: 'NexusTech Systems (Simulated)',
            location: 'San Francisco, CA (Hybrid)',
            status: 'Interested',
            appliedDate: '2026-10-11',
            lastUpdated: '2026-10-11',
            notes: 'Preparing tailored cover letter emphasizing Docker & PostgreSQL.',
            matchScoreAtApply: 82,
          },
        ];
  });

  // Learning Roadmap
  const [learningRoadmap, setLearningRoadmap] = useState<LearningRoadmap | null>(() => {
    const saved = localStorage.getItem('sm_roadmap');
    if (saved) return JSON.parse(saved);

    return {
      id: 'roadmap-default',
      targetRole: 'Full-Stack Developer / Cloud Engineer',
      createdAt: '2026-10-11T00:00:00Z',
      overallProgress: 35,
      milestones: [
        {
          id: 'ms-docker-01',
          skillName: 'Docker & Containerization',
          title: 'Docker Production Optimization',
          description: 'Multi-stage builds, non-root user execution, and container caching.',
          currentProficiency: 'Intermediate',
          targetProficiency: 'Proficient',
          miniProject: 'Build a production microservice with slim distroless image under 80MB.',
          practiceTasks: [
            'Write multi-stage Dockerfile for React and Node.js',
            'Configure docker-compose with local PostgreSQL and Redis',
            'Implement health check directives and non-root UID',
          ],
          recommendedResources: [
            { title: 'Docker Official Best Practices', url: 'https://docs.docker.com', type: 'doc' },
          ],
          estimatedHours: 12,
          completed: true,
          completedAt: '2026-10-08T18:00:00Z',
        },
        {
          id: 'ms-k8s-02',
          skillName: 'Kubernetes Workloads',
          title: 'Deploying Pods, Services & ConfigMaps',
          description: 'Declarative YAML manifests, ingress routing, and liveness/readiness probes.',
          currentProficiency: 'Beginner',
          targetProficiency: 'Intermediate',
          miniProject: 'Deploy 2-tier application onto Minikube cluster with horizontal pod autoscaling.',
          practiceTasks: [
            'Install Minikube or Kind cluster locally',
            'Draft Deployment and ClusterIP Service manifests',
            'Simulate traffic load to test autoscaling triggers',
          ],
          recommendedResources: [
            { title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs', type: 'doc' },
          ],
          estimatedHours: 20,
          completed: false,
        },
        {
          id: 'ms-sys-03',
          skillName: 'System Design & Scalability',
          title: 'High-Throughput Caching & Messaging',
          description: 'Rate limiting with Redis, asynchronous pub/sub queues, and database sharding.',
          currentProficiency: 'Beginner',
          targetProficiency: 'Proficient',
          miniProject: 'Implement an asynchronous task worker queue using BullMQ and Redis in Node.js.',
          practiceTasks: [
            'Design sliding-window rate limiter in Express',
            'Set up Redis caching layer with TTL eviction policies',
            'Document architecture decision record (ADR)',
          ],
          recommendedResources: [
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'tutorial' },
          ],
          estimatedHours: 24,
          completed: false,
        },
      ],
    };
  });

  // Chatbot messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        content: `Hello! I'm your **SkillMatch AI Career Navigator**. I can help you evaluate your resume against top roles, analyze skill gaps, craft high-impact bullet points, and prepare for interviews. How can I help you today?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          'Which jobs best match my skills right now?',
          'What are my highest priority missing skills?',
          'How can I improve my resume summary?',
          'Generate a 3-week study schedule',
        ],
      },
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High Match Found',
      message: 'You have a 92% compatibility match with Pulse UI Labs Frontend Developer role!',
      type: 'success',
      timestamp: '10m ago',
      read: false,
      actionRoute: 'job-recommendations',
    },
    {
      id: 'notif-2',
      title: 'Roadmap Milestone Complete',
      message: 'You successfully completed Docker Production Optimization!',
      type: 'info',
      timestamp: '2h ago',
      read: false,
      actionRoute: 'learning-roadmap',
    },
    {
      id: 'notif-3',
      title: 'Interview Reminder',
      message: 'Upcoming technical screening round scheduled for Oct 16 with Pulse UI Labs.',
      type: 'alert',
      timestamp: '1d ago',
      read: false,
      actionRoute: 'application-tracker',
    },
  ]);

  // System status
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    hasGeminiKey: false,
    status: 'checking',
    model: 'gemini-3.8-flash',
  });

  // Check system status on mount
  useEffect(() => {
    fetch('/api/system/status')
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus({
          hasGeminiKey: Boolean(data.hasGeminiKey),
          status: data.status || 'online',
          model: data.model || 'gemini-3.8-flash',
        });
      })
      .catch(() => {
        setSystemStatus({
          hasGeminiKey: false,
          status: 'demo-mode',
          model: 'gemini-3.8-flash',
        });
      });
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('sm_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (activeProfile) localStorage.setItem('sm_active_profile', JSON.stringify(activeProfile));
  }, [activeProfile]);

  useEffect(() => {
    localStorage.setItem('sm_raw_resume', rawResumeText);
  }, [rawResumeText]);

  useEffect(() => {
    localStorage.setItem('sm_saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem('sm_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (learningRoadmap) localStorage.setItem('sm_roadmap', JSON.stringify(learningRoadmap));
  }, [learningRoadmap]);

  // Helpers
  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.jobId === jobId);
      if (exists) {
        return prev.filter((j) => j.jobId !== jobId);
      } else {
        return [...prev, { jobId, savedAt: new Date().toISOString() }];
      }
    });
  };

  const isJobSaved = (jobId: string) => savedJobs.some((j) => j.jobId === jobId);

  const addApplication = (job: JobListing, notes?: string) => {
    setApplications((prev) => {
      const existing = prev.find((a) => a.jobId === job.id);
      if (existing) return prev;

      const newApp: ApplicationRecord = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: notes || 'Applied via company listing.',
        matchScoreAtApply: 85,
      };

      return [newApp, ...prev];
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Application Added',
        message: `Successfully tracked application for ${job.title} at ${job.company}.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        actionRoute: 'application-tracker',
      },
      ...prev,
    ]);
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              notes: notes !== undefined ? notes : app.notes,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const toggleMilestone = (milestoneId: string) => {
    setLearningRoadmap((prev) => {
      if (!prev) return null;
      const updated = prev.milestones.map((ms) => {
        if (ms.id === milestoneId) {
          const nextCompleted = !ms.completed;
          return {
            ...ms,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return ms;
      });

      const total = updated.length;
      const done = updated.filter((m) => m.completed).length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        ...prev,
        milestones: updated,
        overallProgress: progress,
      };
    });
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `chat-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        content: `Chat history reset. How can I assist you with your career or resume today?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          'Which jobs match my profile?',
          'What are my key missing skills?',
          'Help me prepare for an interview',
        ],
      },
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const loadSampleProfile = (index: number = 0) => {
    const sample = SAMPLE_PROFILES[index % SAMPLE_PROFILES.length];
    setActiveProfile(sample.profile);
    setRawResumeText(sample.rawResume);
    if (user) {
      setUser({
        ...user,
        displayName: sample.profile.fullName,
        headline: sample.profile.title,
        yearsOfExperience: sample.profile.yearsOfExperience,
        confirmedSkills: sample.profile.skills.map((s) => s.name),
      });
    }
  };

  const loginAsDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    loadSampleProfile(0);
    setCurrentRoute('dashboard');
  };

  const logout = () => {
    setUser(null);
    setCurrentRoute('landing');
  };

  const clearAllUserData = () => {
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_active_profile');
    localStorage.removeItem('sm_raw_resume');
    localStorage.removeItem('sm_saved_jobs');
    localStorage.removeItem('sm_applications');
    localStorage.removeItem('sm_roadmap');
    setUser(null);
    setActiveProfile(null);
    setRawResumeText('');
    setSavedJobs([]);
    setApplications([]);
    setLearningRoadmap(null);
    setCurrentRoute('landing');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedJobId,
        setSelectedJobId,
        user,
        setUser,
        activeProfile,
        setActiveProfile,
        rawResumeText,
        setRawResumeText,
        jobs: SIMULATED_JOBS,
        savedJobs,
        toggleSaveJob,
        isJobSaved,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        learningRoadmap,
        setLearningRoadmap,
        toggleMilestone,
        chatMessages,
        addChatMessage,
        clearChat,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        loadSampleProfile,
        systemStatus,
        loginAsDemo,
        logout,
        clearAllUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
