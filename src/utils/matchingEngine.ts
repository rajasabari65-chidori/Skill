import { ExtractedProfile, JobListing, MatchResult, MatchScores, SkillGapDetail } from '../types';

// Map of canonical skill name to common aliases & synonyms
const SKILL_SYNONYMS: Record<string, string[]> = {
  'react': ['react.js', 'reactjs', 'react native'],
  'node.js': ['node', 'nodejs', 'express.js', 'node js'],
  'typescript': ['ts', 'typescript'],
  'javascript': ['js', 'javascript', 'es6', 'es6+'],
  'postgresql': ['postgres', 'psql', 'postgresql'],
  'mongodb': ['mongo', 'mongodb', 'mongoose'],
  'docker': ['containers', 'dockerfile', 'docker compose'],
  'kubernetes': ['k8s', 'kubernetes', 'helm'],
  'aws': ['amazon web services', 'aws lambda', 'aws s3', 'aws ec2', 'cloudwatch'],
  'gcp': ['google cloud', 'google cloud platform', 'bigquery'],
  'ci/cd': ['cicd', 'github actions', 'jenkins', 'gitlab ci', 'continuous integration'],
  'rest api': ['rest', 'restful', 'restful api', 'rest apis', 'api development'],
  'machine learning': ['ml', 'statistical modeling', 'predictive modeling', 'machine learning'],
  'deep learning': ['dl', 'neural networks', 'deep learning'],
  'pytorch': ['torch', 'pytorch'],
  'scikit-learn': ['sklearn', 'scikit learn'],
  'tensorflow': ['tf', 'keras', 'tensorflow'],
  'ui/ux design': ['ui/ux', 'product design', 'user experience', 'ux design', 'user interface'],
  'design systems': ['component library', 'design tokens', 'atomic design'],
  'prompt engineering': ['prompt design', 'few-shot prompting', 'context engineering'],
  'llms': ['large language models', 'genai', 'generative ai', 'gpt', 'gemini'],
  'sql': ['relational databases', 'mysql', 'postgresql', 'sql querying'],
  'tailwind css': ['tailwind', 'tailwindcss'],
  'html5': ['html', 'semantic html'],
  'css3': ['css', 'styling', 'flexbox', 'grid'],
  'agile / scrum': ['agile', 'scrum', 'sprint planning', 'kanban'],
};

function normalizeSkill(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9+#.]/g, '');
}

export function isSkillMatch(candidateSkill: string, targetSkill: string): boolean {
  const normCand = normalizeSkill(candidateSkill);
  const normTarget = normalizeSkill(targetSkill);

  if (normCand === normTarget) return true;
  if (normCand.includes(normTarget) || normTarget.includes(normCand)) return true;

  // Check synonym dictionary
  for (const [canonical, aliases] of Object.entries(SKILL_SYNONYMS)) {
    const allForms = [canonical, ...aliases].map(normalizeSkill);
    const candInGroup = allForms.some(f => f === normCand || normCand.includes(f));
    const targetInGroup = allForms.some(f => f === normTarget || normTarget.includes(f));
    if (candInGroup && targetInGroup) {
      return true;
    }
  }

  return false;
}

export function calculateJobMatch(profile: ExtractedProfile, job: JobListing): MatchResult {
  const candidateSkills = profile.skills.map(s => s.name);

  // 1. Required Skills (50%)
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];
  const skillsNeedingVerification: string[] = [];

  job.requiredSkills.forEach(req => {
    const matched = candidateSkills.find(cs => isSkillMatch(cs, req));
    if (matched) {
      matchedRequired.push(req);
      const skillObj = profile.skills.find(s => s.name === matched);
      if (skillObj && skillObj.confidence === 'low') {
        skillsNeedingVerification.push(req);
      }
    } else {
      missingRequired.push(req);
    }
  });

  const totalReq = Math.max(1, job.requiredSkills.length);
  const requiredScore = Math.round((matchedRequired.length / totalReq) * 100);

  // 2. Preferred Skills (20%)
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  if (job.preferredSkills && job.preferredSkills.length > 0) {
    job.preferredSkills.forEach(pref => {
      const matched = candidateSkills.find(cs => isSkillMatch(cs, pref));
      if (matched) {
        matchedPreferred.push(pref);
      } else {
        missingPreferred.push(pref);
      }
    });
  }

  const hasPreferred = job.preferredSkills && job.preferredSkills.length > 0;
  const preferredScore = hasPreferred
    ? Math.round((matchedPreferred.length / Math.max(1, job.preferredSkills.length)) * 100)
    : 100;

  // 3. Relevant Experience Score (15%)
  const candExp = profile.yearsOfExperience || 0;
  const reqExp = job.minYearsExperience || 0;
  let experienceScore = 100;
  if (reqExp > 0) {
    if (candExp >= reqExp) {
      experienceScore = 100;
    } else {
      // Pro-rated with minimum baseline
      experienceScore = Math.min(95, Math.max(25, Math.round((candExp / reqExp) * 100)));
    }
  }

  // 4. Education & Certifications Score (10%)
  let educationScore = 80; // default baseline for completed profile
  const hasDegree = profile.education && profile.education.length > 0;
  const hasCerts = profile.certifications && profile.certifications.length > 0;
  if (hasDegree) {
    const deg = profile.education[0].degree.toLowerCase();
    if (deg.includes('master') || deg.includes('ph.d') || deg.includes('bachelor') || deg.includes('b.s') || deg.includes('b.a')) {
      educationScore = 100;
    } else {
      educationScore = 85;
    }
  } else if (hasCerts) {
    educationScore = 75;
  } else {
    educationScore = 60;
  }

  // 5. Role Relevance Score (5%)
  let roleRelevanceScore = 50;
  const candTitle = (profile.title || '').toLowerCase();
  const candRoles = (profile.suggestedRoles || []).map(r => r.toLowerCase());
  const jobCategory = job.category.toLowerCase();
  const jobTitle = job.title.toLowerCase();

  if (
    candTitle.includes(jobCategory) ||
    jobTitle.includes(candTitle) ||
    candRoles.some(r => r.includes(jobCategory) || jobCategory.includes(r))
  ) {
    roleRelevanceScore = 100;
  } else if (candSkillsShareCategory(profile, jobCategory)) {
    roleRelevanceScore = 80;
  } else {
    roleRelevanceScore = 40;
  }

  // Weight normalization:
  // Initial: req=0.50, pref=0.20, exp=0.15, edu=0.10, role=0.05
  let wReq = 0.50;
  let wPref = hasPreferred ? 0.20 : 0.00;
  let wExp = 0.15;
  let wEdu = 0.10;
  let wRole = 0.05;

  const totalWeight = wReq + wPref + wExp + wEdu + wRole;
  const normReq = wReq / totalWeight;
  const normPref = wPref / totalWeight;
  const normExp = wExp / totalWeight;
  const normEdu = wEdu / totalWeight;
  const normRole = wRole / totalWeight;

  const rawOverall =
    (requiredScore * normReq) +
    (preferredScore * normPref) +
    (experienceScore * normExp) +
    (educationScore * normEdu) +
    (roleRelevanceScore * normRole);

  const overall = Math.min(100, Math.max(0, Math.round(rawOverall)));

  const scores: MatchScores = {
    overall,
    requiredSkillsScore: requiredScore,
    preferredSkillsScore: preferredScore,
    experienceScore,
    educationScore,
    roleRelevanceScore,
    weights: {
      requiredSkills: Math.round(normReq * 100),
      preferredSkills: Math.round(normPref * 100),
      experience: Math.round(normExp * 100),
      education: Math.round(normEdu * 100),
      roleRelevance: Math.round(normRole * 100),
    },
  };

  // Human-readable explanation
  let explanation = '';
  if (overall >= 85) {
    explanation = `High profile compatibility (${overall}%). Matches ${matchedRequired.length} of ${job.requiredSkills.length} mandatory skills with strong experience alignment (${candExp} yrs vs ${reqExp} yrs required).`;
  } else if (overall >= 70) {
    explanation = `Moderate compatibility (${overall}%). Meets core criteria (${matchedRequired.length}/${job.requiredSkills.length} required skills). Bridging key gaps (${missingRequired.slice(0, 2).join(', ')}) will significantly elevate match competitiveness.`;
  } else {
    explanation = `Foundational alignment (${overall}%). Missing ${missingRequired.length} required competencies including ${missingRequired.slice(0, 3).join(', ')}. Follow the recommended skill gap roadmap before applying.`;
  }

  const recommendedNextSteps: string[] = [];
  if (missingRequired.length > 0) {
    recommendedNextSteps.push(`Focus on mastering high-priority required skill: ${missingRequired[0]}`);
  }
  if (skillsNeedingVerification.length > 0) {
    recommendedNextSteps.push(`Provide concrete project evidence for unverified skill: ${skillsNeedingVerification[0]}`);
  }
  if (overall >= 75) {
    recommendedNextSteps.push(`Tailor your resume professional summary to highlight ${job.category} accomplishments`);
    recommendedNextSteps.push(`Add to Application Tracker and prepare for targeted technical screening`);
  } else {
    recommendedNextSteps.push(`Build a dedicated portfolio mini-project demonstrating ${missingRequired.slice(0, 2).join(' & ')}`);
  }

  return {
    jobId: job.id,
    scores,
    matchedRequiredSkills: matchedRequired,
    missingRequiredSkills: missingRequired,
    matchedPreferredSkills: matchedPreferred,
    missingPreferredSkills: missingPreferred,
    skillsNeedingVerification,
    explanation,
    recommendedNextSteps,
  };
}

function candSkillsShareCategory(profile: ExtractedProfile, jobCategory: string): boolean {
  if (jobCategory.includes('python') && profile.skills.some(s => s.name.toLowerCase() === 'python')) return true;
  if (jobCategory.includes('frontend') && profile.skills.some(s => ['react', 'vue', 'angular', 'javascript', 'html5'].includes(s.name.toLowerCase()))) return true;
  if (jobCategory.includes('data') && profile.skills.some(s => ['sql', 'pandas', 'python', 'r'].includes(s.name.toLowerCase()))) return true;
  if (jobCategory.includes('cloud') && profile.skills.some(s => ['aws', 'docker', 'kubernetes', 'terraform'].includes(s.name.toLowerCase()))) return true;
  return false;
}

export function generateSkillGapsForJob(profile: ExtractedProfile, job: JobListing): SkillGapDetail[] {
  const match = calculateJobMatch(profile, job);
  const candidateSkills = profile.skills;
  const gaps: SkillGapDetail[] = [];

  // Strong & partial matches
  job.requiredSkills.forEach(skill => {
    const isMatched = match.matchedRequiredSkills.includes(skill);
    if (isMatched) {
      const candObj = candidateSkills.find(cs => isSkillMatch(cs.name, skill));
      const isWeak = candObj?.confidence === 'low';
      gaps.push({
        skillName: skill,
        category: candObj?.category || 'Programming',
        status: isWeak ? 'needs-verification' : 'strong-match',
        importance: 'critical',
        whyRequired: `Core prerequisite explicitly listed for ${job.title}. Essential for day-to-day engineering deliverables.`,
        existingEvidence: candObj?.evidence || 'Mentioned in resume overview.',
        whatToLearn: `Advanced design patterns and production scaling techniques in ${skill}.`,
        practiceExercise: `Conduct a code refactoring exercise or performance profile on a ${skill} codebase.`,
        suggestedProject: `A production-ready micro-service showcasing ${skill} test coverage and CI/CD pipelines.`,
        estimatedDuration: '1 - 2 weeks (Refinement)',
      });
    } else {
      gaps.push({
        skillName: skill,
        category: 'Required Prerequisite',
        status: 'missing-required',
        importance: 'critical',
        whyRequired: `Non-negotiable requirement for ${job.title}. Candidates without this skill face automated screening risk.`,
        whatToLearn: `Core syntax, best practices, runtime debugging, and real-world implementation of ${skill}.`,
        practiceExercise: `Complete 10 hands-on coding exercises and build an authenticated sample service with ${skill}.`,
        suggestedProject: `Build an end-to-end portfolio application utilizing ${skill} with comprehensive documentation.`,
        estimatedDuration: '2 - 3 weeks',
      });
    }
  });

  // Preferred skills
  if (job.preferredSkills) {
    job.preferredSkills.forEach(prefSkill => {
      const isMatched = match.matchedPreferredSkills.includes(prefSkill);
      if (isMatched) {
        gaps.push({
          skillName: prefSkill,
          category: 'Preferred Advantage',
          status: 'strong-match',
          importance: 'medium',
          whyRequired: `Differentiating qualification that separates top applicants for this team.`,
          existingEvidence: 'Verified in candidate skills.',
          whatToLearn: `Deepening domain familiarity and enterprise integration patterns.`,
          practiceExercise: `Benchmark and optimize ${prefSkill} integration workflows.`,
          suggestedProject: `Integrate ${prefSkill} into your primary full-stack portfolio showcase.`,
          estimatedDuration: '1 week',
        });
      } else {
        gaps.push({
          skillName: prefSkill,
          category: 'Preferred Advantage',
          status: 'missing-preferred',
          importance: 'medium',
          whyRequired: `Desirable bonus skill that provides competitive advantage during interview rounds.`,
          whatToLearn: `Fundamental workflows, terminology, and key utilities provided by ${prefSkill}.`,
          practiceExercise: `Follow standard introductory tutorials and setup a sample sandbox environment.`,
          suggestedProject: `A showcase script or configuration demonstrating familiarity with ${prefSkill}.`,
          estimatedDuration: '1 - 2 weeks',
        });
      }
    });
  }

  return gaps;
}
