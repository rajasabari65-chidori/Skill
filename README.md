# SkillMatch AI — Smart Career Navigator

**Discover Your Skills. Match Your Career. Build Your Future.**

SkillMatch AI is a complete, production-oriented SaaS web application that helps college students, new graduates, career changers, and experienced software professionals analyze their resumes, uncover verified skill matches, understand critical skill gaps, and accelerate their careers with Google Gemini AI.

---

## 🚀 Key Features

1. **Document Ingestion & Multi-Format Support**
   - Direct client-side parsing of **PDF** and **Word DOCX** files.
   - Text review & editing interface before analysis.
   - 1-Click pre-loaded technical personas (Full-Stack, Data Science, DevOps, UI/UX).

2. **Google Gemini Semantic Resume Analysis**
   - Server-side integration with `gemini-3.8-flash`.
   - Structured JSON output extraction for summary, categorized skills, confidence levels, and verifiable evidence citations.
   - Intelligent fallback parsing engine for offline or demo testing.

3. **Deterministic 5-Factor Job Matching Engine**
   - **Required Skills Coverage (50%)**: Mandatory prerequisites.
   - **Preferred Qualifications (20%)**: Bonus differentiators.
   - **Experience Alignment (15%)**: Verified tenure comparison.
   - **Education & Credentials (10%)**: Degree and certification compatibility.
   - **Role Relevance (5%)**: Title and domain overlap.
   - Synonym normalization dictionary for framework aliases (e.g., React/React.js, Postgres/PostgreSQL, K8s/Kubernetes).

4. **Actionable Skill Gap Matrix**
   - Groups results into Strong Match, Partial Match, Missing Required, and Missing Preferred.
   - Explains why the skill is needed, learning objectives, hands-on practice tasks, and suggested portfolio mini-projects.

5. **Resume Improvement Studio**
   - High-impact bullet point refiner replacing passive phrases with quantifiable achievements.
   - ATS keyword optimizer aligned with target vacancies.
   - Strict anti-hallucination policy preventing fabrication of companies or metrics.

6. **Gemini AI Career Coach**
   - Context-aware chatbot grounded in candidate profile skills and target jobs.
   - Interview prep tips, prompt chips, and pragmatic career roadmaps.

7. **Application Tracker & Kanban Pipeline**
   - 7 recruitment stages: Interested, Applied, Assessment, Interview, Offer, Rejected, and Withdrawn.
   - Interview date reminders, status change controls, and custom notes.

8. **Career Analytics (Recharts)**
   - Visualizations for match score distributions, skill category breakdowns, and application conversion funnels.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend**: Express on Node.js with Vite development middlewares
- **AI Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash`
- **Document Parsers**: `pdfjs-dist` (PDF text extraction), `mammoth` (Word DOCX extraction)
- **Database & Security**: Cloud Firestore data model and `firestore.rules`

---

## ⚙️ Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# GEMINI_API_KEY: Injected by AI Studio Secrets or provided locally
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server (Express + Vite)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

---

## 🔒 Security & Privacy

- **Server-Side API Proxy**: Gemini credentials and API keys are strictly accessed on the backend server (`server.ts`) and never transmitted to client bundles.
- **Zero AI Training**: Resumes are parsed for extraction and are never used to train public foundation models.
- **No Demographics Bias**: Gender, age, religion, and ethnicity are strictly excluded from ranking algorithms.
- **One-Click Purge**: Users can delete all uploaded files, analyses, and saved jobs in the Settings panel at any time.
