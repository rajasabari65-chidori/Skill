import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Status Endpoint
app.get('/api/system/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    version: '1.0.0',
    app: 'SkillMatch AI — Smart Career Navigator',
  });
});

// Resume Analysis Endpoint
app.post('/api/ai/analyze-resume', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
      return res.status(400).json({
        error: 'Resume text is too short or missing. Please provide at least 30 characters of resume content.',
      });
    }

    // If Gemini key is available, use Gemini 3.8 Flash
    if (aiClient) {
      try {
        const systemInstruction = `You are a professional technical recruiter and resume parser.
Extract the candidate's factual details strictly based on the provided text.
CRITICAL INSTRUCTIONS:
1. Do NOT invent degrees, companies, jobs, dates, or metrics that are not explicitly stated in the resume.
2. Group identified skills into appropriate categories: 'Programming', 'Frameworks & Libraries', 'Databases & Cloud', 'Tools & DevOps', 'Soft Skills', 'Domain Expertise'.
3. For each skill, identify the exact or summarized evidence snippet from the resume and mark confidence as 'high' (well documented with projects/experience), 'medium' (listed in skills section without deep elaboration), or 'low' (briefly mentioned).
4. Identify real strengths, constructive resume improvement areas, and 3-4 realistic target career roles based on candidate experience.`;

        const prompt = `Target Role / Focus (if any): ${targetRole || 'Software Engineering / General Tech'}
Resume Content:
"""
${resumeText.slice(0, 14000)}
"""

Extract the candidate's profile into structured JSON format matching this schema:
{
  "fullName": string,
  "email": string,
  "phone": string,
  "location": string,
  "title": string,
  "summary": string,
  "yearsOfExperience": number,
  "skills": [
    {
      "name": string,
      "category": "Programming" | "Frameworks & Libraries" | "Databases & Cloud" | "Tools & DevOps" | "Soft Skills" | "Domain Expertise",
      "evidence": string,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "fieldOfStudy": string,
      "graduationYear": string
    }
  ],
  "experience": [
    {
      "title": string,
      "company": string,
      "duration": string,
      "location": string,
      "description": string,
      "highlights": [string]
    }
  ],
  "projects": [
    {
      "title": string,
      "technologies": [string],
      "description": string,
      "outcome": string
    }
  ],
  "certifications": [string],
  "strengths": [string],
  "improvements": [string],
  "suggestedRoles": [string]
}`;

        const geminiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawJson = geminiResponse.text?.trim() || '{}';
        const parsedData = JSON.parse(rawJson);

        return res.json({
          success: true,
          profile: {
            ...parsedData,
            extractedAt: new Date().toISOString(),
            isSimulated: false,
          },
          provider: 'Gemini 3.8 Flash',
        });
      } catch (geminiError: unknown) {
        console.warn('Gemini API call failed or timed out, falling back to deterministic extraction:', geminiError);
      }
    }

    // Graceful Fallback: Deterministic rule-based parsing engine
    const fallbackProfile = fallbackRuleBasedExtractor(resumeText, targetRole);
    return res.json({
      success: true,
      profile: fallbackProfile,
      provider: 'Rule-Based Fallback Engine (Demo Mode)',
      note: 'Analyzed using local deterministic parsing engine. Connect a GEMINI_API_KEY in environment secrets for deep semantic extraction.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal analysis error';
    return res.status(500).json({ error: message });
  }
});

// Resume Improvement Endpoint
app.post('/api/ai/improve-resume', async (req: Request, res: Response) => {
  try {
    const { sectionType, text, targetRole } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content to improve is required.' });
    }

    if (aiClient) {
      try {
        const prompt = `You are an elite career coach and executive resume writer.
Task: Improve the following ${sectionType || 'resume section'} for a candidate targeting '${targetRole || 'Software Engineering'}'.
Rules:
1. Do NOT invent fake companies, jobs, or degrees.
2. If metrics are missing, use clear placeholders like '[X% increase]' or suggest how the candidate can measure impact.
3. Use strong active action verbs (Engineered, Architected, Reduced, Streamlined, Spearheaded).
4. Provide a clear rationale explaining what changed and why it helps ATS and human recruiters.

Original text:
"${text}"

Return JSON:
{
  "improvedText": "High-impact revised version",
  "keyChanges": ["Change 1", "Change 2", "Change 3"],
  "recruiterRationale": "Explanation of ATS keyword density and clarity improvements",
  "keywordsAdded": ["keyword1", "keyword2"]
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const data = JSON.parse(response.text?.trim() || '{}');
        return res.json({ success: true, ...data, isSimulated: false });
      } catch (err) {
        console.warn('Gemini improve call failed, returning rule-based improvement:', err);
      }
    }

    // Fallback improvement suggestion
    const improved = text.replace(/responsible for/gi, 'Spearheaded')
      .replace(/helped with/gi, 'Engineered critical modules for')
      .replace(/worked on/gi, 'Architected and deployed');

    return res.json({
      success: true,
      improvedText: `${improved} — demonstrated measurable efficiency gains across core deliverables.`,
      keyChanges: [
        'Replaced passive phrases with high-impact action verbs (Spearheaded, Architected)',
        'Structured outcome around business deliverables',
        'Enhanced ATS keyword visibility for technical screening',
      ],
      recruiterRationale: 'Action-verb led bullet points improve recruiter engagement and demonstrate ownership rather than passive participation.',
      keywordsAdded: [targetRole || 'Engineering', 'Architecture', 'Performance'],
      isSimulated: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Improvement failed';
    return res.status(500).json({ error: message });
  }
});

// AI Career Assistant Chatbot Endpoint
app.post('/api/ai/career-chat', async (req: Request, res: Response) => {
  try {
    const { messages, candidateProfile, currentJobContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const latestMessage = messages[messages.length - 1]?.content || '';

    if (aiClient) {
      try {
        const systemInstruction = `You are 'SkillMatch AI Career Navigator', a senior technical career advisor and mentor.
Candidate Background:
- Name: ${candidateProfile?.fullName || 'Candidate'}
- Title: ${candidateProfile?.title || 'Job Seeker'}
- Years of Experience: ${candidateProfile?.yearsOfExperience || '1-3'}
- Top Skills: ${(candidateProfile?.skills || []).slice(0, 15).map((s: { name: string }) => s.name).join(', ') || 'General Software Skills'}
${currentJobContext ? `- Currently Inspecting Role: ${currentJobContext.title} at ${currentJobContext.company}` : ''}

CRITICAL RULES:
1. Provide practical, encouraging, and honest advice.
2. NEVER guarantee job offers, placement percentages, or specific salaries.
3. Structure responses with clear bullet points, actionable steps, and realistic study hours.
4. If asked for interview prep, provide realistic technical and behavioral question examples.`;

        // Format history
        const conversationHistory = messages.slice(-6).map((m: { sender: string; content: string }) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

        const prompt = `${conversationHistory}\n\nUser: ${latestMessage}\n\nAssistant:`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });

        const reply = response.text || 'I apologize, I could not generate a response. Please try again.';

        return res.json({
          success: true,
          reply,
          suggestions: [
            'Which skills should I prioritize this week?',
            'How can I tailor my resume for this role?',
            'What sample interview questions will I be asked?',
          ],
        });
      } catch (geminiChatError) {
        console.warn('Gemini chat error, falling back:', geminiChatError);
      }
    }

    // Fallback simulated chat response
    return res.json({
      success: true,
      reply: `Based on your profile as a ${candidateProfile?.title || 'technical candidate'} with focus on ${(candidateProfile?.skills || []).slice(0, 3).map((s: { name: string }) => s.name).join(', ') || 'software engineering'}:

1. **Strategic Priority**: Focus on bridging gaps in high-demand areas like cloud deployments (Docker, AWS) and system architecture.
2. **Resume Tip**: Quantify accomplishments in your project bullets (e.g., latency reduction, user counts, or test coverage percentages).
3. **Interview Preparation**: Practice articulating trade-offs between tools and design patterns.

*Note: Running in simulated demo mode. Connect GEMINI_API_KEY for dynamic real-time AI responses.*`,
      suggestions: [
        'How do I explain my projects effectively?',
        'What are the most common interview questions for this role?',
        'Recommend a 3-week learning schedule',
      ],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Chat error';
    return res.status(500).json({ error: message });
  }
});

// Learning Roadmap Generation Endpoint
app.post('/api/ai/generate-roadmap', async (req: Request, res: Response) => {
  try {
    const { targetRole, missingSkills } = req.body;

    const skillsToPlan = (missingSkills && Array.isArray(missingSkills) && missingSkills.length > 0)
      ? missingSkills.slice(0, 4)
      : ['Docker', 'System Design', 'CI/CD Pipelines'];

    if (aiClient) {
      try {
        const prompt = `Create a realistic, step-by-step career learning roadmap for a candidate pursuing the role of '${targetRole || 'Full-Stack Developer'}'.
Skills to address: ${skillsToPlan.join(', ')}.

Requirements:
- Create 3-4 structured milestones.
- For each milestone provide: skillName, title, description, currentProficiency ('Beginner'), targetProficiency ('Proficient'), miniProject, practiceTasks (2-3 items), recommendedResources, estimatedHours.
- Return valid JSON matching the schema:
{
  "milestones": [
    {
      "id": string,
      "skillName": string,
      "title": string,
      "description": string,
      "currentProficiency": "Beginner",
      "targetProficiency": "Proficient",
      "miniProject": string,
      "practiceTasks": [string],
      "recommendedResources": [
        { "title": string, "url": string, "type": "doc" | "course" | "tutorial" }
      ],
      "estimatedHours": number,
      "completed": false
    }
  ]
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const data = JSON.parse(response.text?.trim() || '{}');
        return res.json({
          success: true,
          milestones: data.milestones || [],
          isSimulated: false,
        });
      } catch (err) {
        console.warn('Gemini roadmap generation failed, using fallback template:', err);
      }
    }

    // Deterministic fallback milestones
    const fallbackMilestones = skillsToPlan.map((skill: string, index: number) => ({
      id: `ms-${index + 1}-${Date.now()}`,
      skillName: skill,
      title: `Mastery & Implementation: ${skill}`,
      description: `Understand the foundational paradigms, architecture, and common production workflows for ${skill}.`,
      currentProficiency: 'Beginner' as const,
      targetProficiency: 'Proficient' as const,
      miniProject: `Deploy a production-grade sample project implementing ${skill} with automated validation and documentation.`,
      practiceTasks: [
        `Complete official getting-started tutorials and write 3 core scripts using ${skill}`,
        `Configure local debugging and automated test suites for ${skill}`,
        `Benchmark performance and write a concise technical decision guide`,
      ],
      recommendedResources: [
        { title: `${skill} Official Documentation & Guides`, url: 'https://docs.github.com', type: 'doc' as const },
        { title: `Interactive ${skill} Architecture Fundamentals`, url: 'https://roadmap.sh', type: 'tutorial' as const },
      ],
      estimatedHours: 15 + index * 5,
      completed: false,
    }));

    return res.json({
      success: true,
      milestones: fallbackMilestones,
      isSimulated: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Roadmap generation failed';
    return res.status(500).json({ error: message });
  }
});

// Deterministic rule-based resume fallback parser
function fallbackRuleBasedExtractor(rawText: string, targetRole?: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const fullName = lines[0]?.slice(0, 40) || 'Candidate Profile';

  // Basic email extraction
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  // Skill keyword library
  const KNOWN_SKILLS: { name: string; category: any }[] = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'Python', category: 'Programming' },
    { name: 'Java', category: 'Programming' },
    { name: 'C++', category: 'Programming' },
    { name: 'Go', category: 'Programming' },
    { name: 'SQL', category: 'Programming' },
    { name: 'HTML5', category: 'Frameworks & Libraries' },
    { name: 'CSS3', category: 'Frameworks & Libraries' },
    { name: 'React', category: 'Frameworks & Libraries' },
    { name: 'Node.js', category: 'Frameworks & Libraries' },
    { name: 'Express', category: 'Frameworks & Libraries' },
    { name: 'Next.js', category: 'Frameworks & Libraries' },
    { name: 'FastAPI', category: 'Frameworks & Libraries' },
    { name: 'Tailwind CSS', category: 'Frameworks & Libraries' },
    { name: 'Pandas', category: 'Frameworks & Libraries' },
    { name: 'PyTorch', category: 'Frameworks & Libraries' },
    { name: 'Scikit-Learn', category: 'Frameworks & Libraries' },
    { name: 'PostgreSQL', category: 'Databases & Cloud' },
    { name: 'MongoDB', category: 'Databases & Cloud' },
    { name: 'Redis', category: 'Databases & Cloud' },
    { name: 'AWS', category: 'Databases & Cloud' },
    { name: 'Docker', category: 'Tools & DevOps' },
    { name: 'Kubernetes', category: 'Tools & DevOps' },
    { name: 'Git', category: 'Tools & DevOps' },
    { name: 'CI/CD', category: 'Tools & DevOps' },
    { name: 'Linux', category: 'Tools & DevOps' },
    { name: 'Figma', category: 'Tools & DevOps' },
    { name: 'REST API', category: 'Frameworks & Libraries' },
    { name: 'Machine Learning', category: 'Domain Expertise' },
    { name: 'UI/UX Design', category: 'Domain Expertise' },
    { name: 'Agile / Scrum', category: 'Soft Skills' },
    { name: 'Problem Solving', category: 'Soft Skills' },
  ];

  const detectedSkills: any[] = [];
  const lowerText = rawText.toLowerCase();

  KNOWN_SKILLS.forEach(s => {
    const sLower = s.name.toLowerCase();
    if (lowerText.includes(sLower)) {
      // Find sentence context
      const index = lowerText.indexOf(sLower);
      const start = Math.max(0, index - 40);
      const end = Math.min(rawText.length, index + s.name.length + 50);
      const snippet = rawText.slice(start, end).replace(/\n/g, ' ').trim();

      detectedSkills.push({
        name: s.name,
        category: s.category,
        evidence: `Mentioned in resume: "...${snippet}..."`,
        confidence: snippet.length > 50 ? 'high' : 'medium',
      });
    }
  });

  // Estimate experience
  let years = 1.5;
  const yearMatches = rawText.match(/(20\d{2})\s*[-–—to]+\s*(20\d{2}|present)/gi);
  if (yearMatches && yearMatches.length > 0) {
    years = Math.min(10, yearMatches.length * 1.5);
  }

  return {
    fullName,
    email: emailMatch ? emailMatch[0] : 'candidate@example.com',
    phone: phoneMatch ? phoneMatch[0] : '(555) 000-0000',
    location: 'United States',
    title: targetRole || (detectedSkills.some(s => s.name === 'React') ? 'Frontend / Full-Stack Developer' : 'Software Engineer'),
    summary: `Extracted candidate profile with demonstrated competencies in ${detectedSkills.slice(0, 5).map(s => s.name).join(', ') || 'Software Development'}.`,
    yearsOfExperience: Math.round(years * 10) / 10,
    skills: detectedSkills.length > 0 ? detectedSkills : [
      { name: 'Git', category: 'Tools & DevOps', evidence: 'Basic version control usage', confidence: 'medium' },
      { name: 'Problem Solving', category: 'Soft Skills', evidence: 'Demonstrated through education and projects', confidence: 'high' },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science or Related Field',
        institution: 'Accredited University',
        graduationYear: '2023',
      },
    ],
    experience: [
      {
        title: targetRole || 'Software Developer',
        company: 'Technology Experience',
        duration: '2023 – Present',
        description: 'Engineered web applications and software systems with focus on code quality and team delivery.',
        highlights: [
          'Developed key modules in collaboration with engineering team',
          'Participated in code reviews and test validation',
        ],
      },
    ],
    projects: [
      {
        title: 'Core Portfolio Project',
        technologies: detectedSkills.slice(0, 4).map(s => s.name),
        description: 'Engineered application demonstrating proficiency in modern development stacks.',
      },
    ],
    certifications: [],
    strengths: [
      'Good baseline technical vocabulary and tool adoption',
      'Hands-on project work aligned with contemporary developer stacks',
    ],
    improvements: [
      'Add quantitative outcome metrics (e.g. latency, user growth, or performance %)',
      'Include links to verifiable GitHub repositories or hosted portfolio projects',
    ],
    suggestedRoles: [
      targetRole || 'Software Developer',
      'Full-Stack Developer',
      'Frontend Developer',
    ],
    extractedAt: new Date().toISOString(),
    isSimulated: true,
  };
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[SkillMatch AI] Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
