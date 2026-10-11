export type WorkMode = 'remote' | 'hybrid' | 'on-site';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';

export interface ExtractedSkill {
  name: string;
  category: 'Programming' | 'Frameworks & Libraries' | 'Databases & Cloud' | 'Tools & DevOps' | 'Soft Skills' | 'Domain Expertise';
  evidence?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface EducationItem {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  graduationYear?: string | number;
  grade?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration?: string;
  location?: string;
  description: string;
  highlights?: string[];
}

export interface ProjectItem {
  title: string;
  technologies: string[];
  description: string;
  outcome?: string;
  link?: string;
}

export interface ExtractedProfile {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  title: string;
  summary: string;
  yearsOfExperience: number;
  skills: ExtractedSkill[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  strengths: string[];
  improvements: string[];
  suggestedRoles: string[];
  extractedAt: string;
  isSimulated?: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  minYearsExperience: number;
  salaryRange?: string;
  description: string;
  category: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements?: string;
  applicationUrl: string;
  source: string;
  verifiedAt: string;
  isSimulated: boolean;
}

export interface MatchScores {
  overall: number; // 0 - 100
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  educationScore: number;
  roleRelevanceScore: number;
  weights: {
    requiredSkills: number;
    preferredSkills: number;
    experience: number;
    education: number;
    roleRelevance: number;
  };
}

export interface MatchResult {
  jobId: string;
  scores: MatchScores;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  skillsNeedingVerification: string[];
  explanation: string;
  recommendedNextSteps: string[];
}

export interface SkillGapDetail {
  skillName: string;
  category: string;
  status: 'strong-match' | 'partial-match' | 'missing-required' | 'missing-preferred' | 'needs-verification';
  importance: 'critical' | 'high' | 'medium' | 'low';
  whyRequired: string;
  existingEvidence?: string;
  whatToLearn: string;
  practiceExercise: string;
  suggestedProject: string;
  estimatedDuration: string; // e.g. "1 - 2 weeks"
}

export interface LearningMilestone {
  id: string;
  skillName: string;
  title: string;
  description: string;
  currentProficiency: 'None' | 'Beginner' | 'Intermediate';
  targetProficiency: 'Intermediate' | 'Proficient' | 'Advanced';
  miniProject: string;
  practiceTasks: string[];
  recommendedResources: { title: string; url?: string; type: 'doc' | 'course' | 'tutorial' }[];
  estimatedHours: number;
  completed: boolean;
  completedAt?: string;
}

export interface LearningRoadmap {
  id: string;
  targetRole: string;
  targetJobTitle?: string;
  createdAt: string;
  milestones: LearningMilestone[];
  overallProgress: number; // percentage 0 - 100
}

export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes: string;
  matchScoreAtApply: number;
  interviewDate?: string;
  salaryOffered?: string;
}

export interface SavedJobRecord {
  jobId: string;
  savedAt: string;
  notes?: string;
}

export interface UserPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  preferredWorkMode: WorkMode[];
  preferredEmploymentType: EmploymentType[];
  targetSalaryMin?: number;
  openToRelocation: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  headline?: string;
  bio?: string;
  location?: string;
  yearsOfExperience: number;
  graduationYear?: number;
  degree?: string;
  specialization?: string;
  confirmedSkills: string[];
  preferences: UserPreferences;
  isDemoUser: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}
