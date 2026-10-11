import { ExtractedProfile } from '../types';

export const SAMPLE_PROFILES: { label: string; role: string; profile: ExtractedProfile; rawResume: string }[] = [
  {
    label: 'Full-Stack Developer (MERN / TypeScript)',
    role: 'Full-Stack Developer',
    rawResume: `ALEX CHEN
San Francisco, CA | alex.chen.dev@example.com | (555) 349-8812 | github.com/alexchen-dev

PROFESSIONAL SUMMARY
Full-Stack Software Engineer with 2.5 years of experience architecting and shipping web applications using React, TypeScript, Node.js, and PostgreSQL. Passionate about developer tooling, performant REST APIs, and responsive design systems.

TECHNICAL SKILLS
• Programming: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
• Frameworks & Libraries: React, Node.js, Express, Next.js, Tailwind CSS, Redux Toolkit
• Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2)
• Tools & Methodologies: Git, GitHub Actions, Jest, REST APIs, Agile / Scrum

EXPERIENCE
Software Engineer | Apex Cloud Solutions | Austin, TX
July 2024 – Present
• Engineered multi-tenant dashboard in React and TypeScript serving 15,000+ weekly active enterprise users.
• Designed and maintained 18+ REST API microservices in Node.js and Express with PostgreSQL, reducing p95 latency by 32%.
• Containerized development and staging pipelines using Docker and configured automated CI/CD checks via GitHub Actions.
• Collaborated in bi-weekly Agile sprints with cross-functional teams of 6 engineers and 2 product designers.

Junior Frontend Developer | Lumina Web Labs | San Jose, CA
Jan 2023 – June 2024
• Built responsive landing pages and user profile modules using React, Tailwind CSS, and HTML5/CSS3.
• Implemented client-side state management with Redux and integrated third-party payment APIs.
• Wrote comprehensive unit tests using Jest, achieving 84% test coverage across core component libraries.

PROJECTS
DevPulse – Engineering Metrics Dashboard (TypeScript, React, Node.js, PostgreSQL)
• Built an open-source analytics portal syncing GitHub pull request metrics and deployment health.
• Implemented JWT authentication, role-based access control, and real-time activity feeds via WebSockets.

E-Commerce Storefront Prototype (React, Tailwind CSS, Stripe API)
• Developed mobile-first shopping interface with cart persistence, instant search filtering, and checkout flow.

EDUCATION
B.S. in Computer Science | San Jose State University | Graduated May 2023 | GPA: 3.7/4.0

CERTIFICATIONS
• AWS Certified Cloud Practitioner (2024)
`,
    profile: {
      fullName: 'Alex Chen',
      email: 'alex.chen.dev@example.com',
      phone: '(555) 349-8812',
      location: 'San Francisco, CA',
      title: 'Full-Stack Software Engineer',
      summary: 'Full-Stack Software Engineer with 2.5 years of experience architecting web applications using React, TypeScript, Node.js, and PostgreSQL. Experienced in microservices, Docker containerization, and REST API design.',
      yearsOfExperience: 2.5,
      skills: [
        { name: 'React', category: 'Frameworks & Libraries', evidence: 'Engineered multi-tenant dashboard in React serving 15,000+ active users', confidence: 'high' },
        { name: 'TypeScript', category: 'Programming', evidence: 'Built frontend applications and typed backend services in TypeScript', confidence: 'high' },
        { name: 'JavaScript', category: 'Programming', evidence: 'Core language across all frontend and backend projects', confidence: 'high' },
        { name: 'Node.js', category: 'Frameworks & Libraries', evidence: 'Designed and maintained 18+ REST API microservices in Node.js', confidence: 'high' },
        { name: 'Express', category: 'Frameworks & Libraries', evidence: 'Created backend services with Express and PostgreSQL', confidence: 'high' },
        { name: 'PostgreSQL', category: 'Databases & Cloud', evidence: 'Optimized schema and queries, reducing p95 latency by 32%', confidence: 'high' },
        { name: 'Docker', category: 'Tools & DevOps', evidence: 'Containerized development and staging pipelines using Docker', confidence: 'high' },
        { name: 'Git', category: 'Tools & DevOps', evidence: 'Version control across multi-developer repositories and CI/CD', confidence: 'high' },
        { name: 'REST API', category: 'Frameworks & Libraries', evidence: 'Built 18+ microservice REST endpoints', confidence: 'high' },
        { name: 'Tailwind CSS', category: 'Frameworks & Libraries', evidence: 'Built responsive UI layouts and design systems', confidence: 'high' },
        { name: 'Python', category: 'Programming', evidence: 'Listed in technical skills for scripting and utility workflows', confidence: 'medium' },
        { name: 'SQL', category: 'Programming', evidence: 'Extensive querying on PostgreSQL and database migrations', confidence: 'high' },
        { name: 'AWS', category: 'Databases & Cloud', evidence: 'AWS Certified Cloud Practitioner; deployed on S3 and EC2', confidence: 'medium' },
        { name: 'Redis', category: 'Databases & Cloud', evidence: 'Used for caching in web microservices', confidence: 'medium' },
        { name: 'Agile / Scrum', category: 'Soft Skills', evidence: 'Collaborated in bi-weekly Agile sprints with cross-functional teams', confidence: 'high' },
        { name: 'Problem Solving', category: 'Soft Skills', evidence: 'Demonstrated through system latency optimization and project deliveries', confidence: 'high' },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'San Jose State University',
          fieldOfStudy: 'Computer Science',
          graduationYear: 2023,
          grade: '3.7 / 4.0 GPA',
        },
      ],
      experience: [
        {
          title: 'Software Engineer',
          company: 'Apex Cloud Solutions',
          duration: 'July 2024 – Present',
          location: 'Austin, TX',
          description: 'Engineered multi-tenant web application in React and TypeScript. Architected backend microservices in Node.js with PostgreSQL.',
          highlights: [
            'Engineered multi-tenant dashboard serving 15,000+ weekly active users',
            'Reduced p95 latency by 32% across 18+ REST endpoints',
            'Implemented Docker containerization and automated CI/CD GitHub Actions',
          ],
        },
        {
          title: 'Junior Frontend Developer',
          company: 'Lumina Web Labs',
          duration: 'Jan 2023 – June 2024',
          location: 'San Jose, CA',
          description: 'Built responsive user interfaces with React and Tailwind CSS. Implemented Redux state and Jest test suites.',
          highlights: [
            'Built responsive landing pages and profile modules',
            'Achieved 84% unit test coverage using Jest',
          ],
        },
      ],
      projects: [
        {
          title: 'DevPulse – Engineering Metrics Dashboard',
          technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          description: 'Open-source developer portal aggregating GitHub pull request statistics and real-time deployment status.',
          outcome: 'Achieved 400+ stars on GitHub and reduced sprint reporting time by 60%.',
        },
        {
          title: 'E-Commerce Storefront Prototype',
          technologies: ['React', 'Tailwind CSS', 'Stripe API'],
          description: 'Mobile-first e-commerce catalog with search filtering, cart state management, and checkout integration.',
        },
      ],
      certifications: [
        'AWS Certified Cloud Practitioner (2024)',
      ],
      strengths: [
        'Strong full-stack foundation combining modern TypeScript React with Node.js backend services',
        'Demonstrated database optimization and microservice architecture experience',
        'Proven delivery in production environments with containerization and CI/CD pipelines',
      ],
      improvements: [
        'Add quantified production metrics to older frontend projects',
        'Expand backend distributed systems knowledge (e.g., Kafka or gRPC) for senior roles',
        'Highlight system design experience or architectural decision records',
      ],
      suggestedRoles: [
        'Full-Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Software Developer',
      ],
      extractedAt: '2026-10-11T07:00:00Z',
      isSimulated: true,
    },
  },
  {
    label: 'Data Scientist & ML Engineer (Python / PyTorch)',
    role: 'Data Scientist',
    rawResume: `SAMANTHA RAO
Boston, MA | samantha.rao.ds@example.com | (555) 782-9901 | linkedin.com/in/samantharao-ds

PROFESSIONAL SUMMARY
Data Scientist & Machine Learning Engineer with 3+ years of experience developing predictive models, feature pipelines, and statistical analysis workflows. Adept at Python, SQL, Pandas, Scikit-Learn, and PyTorch.

TECHNICAL SKILLS
• Core Languages: Python, SQL, R
• Machine Learning: PyTorch, Scikit-Learn, TensorFlow basics, XGBoost, Regression, Classification
• Data Wrangling & Analytics: Pandas, NumPy, SciPy, Statistics, Exploratory Data Analysis, Data Visualization
• Tools & Platforms: Jupyter, Git, Docker, Tableau, MLflow, AWS S3

EXPERIENCE
Data Scientist | BioMetrics Health Analytics | Boston, MA
August 2023 – Present
• Developed predictive disease-risk scoring models using Scikit-Learn and XGBoost, achieving 0.89 ROC-AUC across 120,000+ patient records.
• Formulated automated data cleaning and imputation pipelines in Python and Pandas, saving 14 hours of manual data prep weekly.
• Partnered with clinical stakeholders to deploy Tableau dashboards communicating model confidence intervals.

Junior Machine Learning Engineer | DataCore Systems | Cambridge, MA
June 2022 – July 2023
• Trained deep learning computer vision classifiers in PyTorch for automated defect inspection.
• Built REST API inference wrappers using FastAPI and packaged services into Docker containers.

EDUCATION
Master of Science in Data Science | Boston University | 2022
Bachelor of Science in Statistics | University of Michigan | 2020

PROJECTS
Customer Churn Prediction Engine (Python, Pandas, Scikit-Learn, Streamlit)
• Analyzed 50,000 customer accounts; built Random Forest and Logistic Regression classifiers.
`,
    profile: {
      fullName: 'Samantha Rao',
      email: 'samantha.rao.ds@example.com',
      phone: '(555) 782-9901',
      location: 'Boston, MA',
      title: 'Data Scientist & ML Engineer',
      summary: 'Data Scientist with 3+ years of experience training predictive machine learning models in Python, PyTorch, and Scikit-Learn. Skilled in statistics, SQL data pipelines, and communicating insights to cross-functional teams.',
      yearsOfExperience: 3.2,
      skills: [
        { name: 'Python', category: 'Programming', evidence: 'Primary language across 3+ years of modeling and data manipulation', confidence: 'high' },
        { name: 'SQL', category: 'Programming', evidence: 'Extracted cohorts and joined patient data from relational databases', confidence: 'high' },
        { name: 'Pandas', category: 'Frameworks & Libraries', evidence: 'Formulated automated data cleaning pipelines saving 14 hours weekly', confidence: 'high' },
        { name: 'Scikit-Learn', category: 'Frameworks & Libraries', evidence: 'Developed predictive risk scoring models achieving 0.89 ROC-AUC', confidence: 'high' },
        { name: 'PyTorch', category: 'Frameworks & Libraries', evidence: 'Trained deep learning computer vision classifiers for defect inspection', confidence: 'high' },
        { name: 'Machine Learning', category: 'Domain Expertise', evidence: 'Built classification, regression, and tree-based ensemble models', confidence: 'high' },
        { name: 'Statistics', category: 'Domain Expertise', evidence: 'B.S. in Statistics; computed hypothesis testing and confidence intervals', confidence: 'high' },
        { name: 'Data Visualization', category: 'Domain Expertise', evidence: 'Designed Tableau dashboards communicating clinical model risk', confidence: 'high' },
        { name: 'Docker', category: 'Tools & DevOps', evidence: 'Packaged ML inference services into Docker containers', confidence: 'medium' },
        { name: 'Git', category: 'Tools & DevOps', evidence: 'Collaborative code version control and model tracking', confidence: 'high' },
        { name: 'Tableau', category: 'Tools & DevOps', evidence: 'Built executive dashboards for clinical stakeholders', confidence: 'medium' },
      ],
      education: [
        {
          degree: 'Master of Science in Data Science',
          institution: 'Boston University',
          graduationYear: 2022,
        },
        {
          degree: 'Bachelor of Science in Statistics',
          institution: 'University of Michigan',
          graduationYear: 2020,
        },
      ],
      experience: [
        {
          title: 'Data Scientist',
          company: 'BioMetrics Health Analytics',
          duration: 'August 2023 – Present',
          location: 'Boston, MA',
          description: 'Developed predictive disease-risk scoring models using Scikit-Learn and XGBoost.',
          highlights: [
            'Achieved 0.89 ROC-AUC across 120,000+ patient records',
            'Formulated automated data cleaning in Python and Pandas saving 14 hours weekly',
          ],
        },
      ],
      projects: [
        {
          title: 'Customer Churn Prediction Engine',
          technologies: ['Python', 'Pandas', 'Scikit-Learn', 'Streamlit'],
          description: 'Analyzed 50,000 accounts; built Random Forest and Logistic Regression classifiers.',
        },
      ],
      certifications: [],
      strengths: [
        'Deep statistical foundations backed by B.S. in Statistics and M.S. in Data Science',
        'Demonstrated success with production models delivering 0.89 ROC-AUC',
        'Strong Python data engineering and exploratory data analysis skills',
      ],
      improvements: [
        'Add experience with modern distributed data tools like Spark or BigQuery',
        'Highlight MLOps pipelines (e.g., automated model retraining and drift monitoring)',
      ],
      suggestedRoles: [
        'Data Scientist',
        'Data Analyst',
        'Machine Learning Engineer',
        'Python Developer',
      ],
      extractedAt: '2026-10-11T07:00:00Z',
      isSimulated: true,
    },
  },
  {
    label: 'Cloud & DevOps Engineer (AWS / Kubernetes)',
    role: 'Cloud Engineer',
    rawResume: `MARCUS VANCE
Dallas, TX | marcus.vance.cloud@example.com | (555) 612-4490

PROFESSIONAL SUMMARY
DevOps & Cloud Systems Engineer with 3+ years automating cloud infrastructure, orchestrating Kubernetes workloads, and optimizing CI/CD release cycles on AWS.

TECHNICAL SKILLS
• Cloud Platforms: AWS (EC2, EKS, RDS, S3, IAM, CloudWatch), GCP fundamentals
• Infrastructure as Code: Terraform, Ansible
• Containers & Orchestration: Docker, Kubernetes, Helm
• CI/CD & Scripting: GitHub Actions, Jenkins, Bash, Python, Linux Administration
• Observability & Security: Prometheus, Grafana, Cloud Security, Git

EXPERIENCE
Cloud Infrastructure Engineer | OmniScale Networks | Dallas, TX
Nov 2023 – Present
• Provisioned high-availability AWS infrastructure with Terraform, decreasing deployment provisioning time from 4 days to 45 minutes.
• Migrated 28 monolithic microservices into AWS EKS (Kubernetes) with zero downtime.
• Implemented automated security vulnerability scanning in GitHub Actions CI/CD pipelines.

EDUCATION
B.S. in Information Technology | University of North Texas | 2022
`,
    profile: {
      fullName: 'Marcus Vance',
      email: 'marcus.vance.cloud@example.com',
      phone: '(555) 612-4490',
      location: 'Dallas, TX',
      title: 'Cloud & DevOps Engineer',
      summary: 'Cloud Systems Engineer with 3+ years of experience provisioning AWS infrastructure via Terraform and orchestrating Kubernetes clusters.',
      yearsOfExperience: 3.5,
      skills: [
        { name: 'AWS', category: 'Databases & Cloud', evidence: 'Provisioned multi-account AWS infrastructure (EKS, EC2, RDS, S3)', confidence: 'high' },
        { name: 'Docker', category: 'Tools & DevOps', evidence: 'Containerized 28 microservices for Kubernetes deployment', confidence: 'high' },
        { name: 'Kubernetes', category: 'Tools & DevOps', evidence: 'Migrated 28 microservices into AWS EKS with zero downtime', confidence: 'high' },
        { name: 'Terraform', category: 'Tools & DevOps', evidence: 'Reduced cloud provisioning time from 4 days to 45 minutes', confidence: 'high' },
        { name: 'Linux', category: 'Tools & DevOps', evidence: 'Server administration, bash automation, and kernel tuning', confidence: 'high' },
        { name: 'CI/CD', category: 'Tools & DevOps', evidence: 'Configured automated pipelines with GitHub Actions and Jenkins', confidence: 'high' },
        { name: 'Git', category: 'Tools & DevOps', evidence: 'Infrastructure as Code repo governance and pull request reviews', confidence: 'high' },
        { name: 'Python', category: 'Programming', evidence: 'Scripting automation and Lambda functions', confidence: 'medium' },
      ],
      education: [
        {
          degree: 'B.S. in Information Technology',
          institution: 'University of North Texas',
          graduationYear: 2022,
        },
      ],
      experience: [
        {
          title: 'Cloud Infrastructure Engineer',
          company: 'OmniScale Networks',
          duration: 'Nov 2023 – Present',
          location: 'Dallas, TX',
          description: 'Provisioned high-availability AWS infrastructure with Terraform and managed EKS clusters.',
        },
      ],
      projects: [],
      certifications: ['AWS Certified Solutions Architect Associate (2024)'],
      strengths: ['Hands-on production Terraform and Kubernetes migration track record', 'Strong infrastructure automation and security awareness'],
      improvements: ['Add deeper software development portfolio (e.g. Go backend tools)'],
      suggestedRoles: ['Cloud Engineer', 'DevOps Engineer', 'Site Reliability Engineer'],
      extractedAt: '2026-10-11T07:00:00Z',
      isSimulated: true,
    },
  },
  {
    label: 'UI/UX & Product Designer (Figma / Research)',
    role: 'UI/UX Designer',
    rawResume: `ELENA ROSTOVA
Los Angeles, CA | elena.rostova.design@example.com | (555) 902-1234 | elenarostova.design

PROFESSIONAL SUMMARY
Product Designer with 3+ years designing intuitive web and mobile interfaces. Specialist in Figma design systems, responsive wireframing, and user research.

TECHNICAL SKILLS
• Design: UI/UX Design, Figma, Wireframing, Prototyping, Design Systems, User Research, Usability Testing
• Web Literacy: HTML5, CSS3, Responsive Design, Design Tokens
• Tools: Miro, FigJam, Jira, Notion

EXPERIENCE
Product Designer | Studio Helix | Los Angeles, CA
March 2023 – Present
• Designed B2B SaaS dashboard used by 40+ enterprise clients, increasing daily user engagement by 28%.
• Built comprehensive Figma design system with 250+ accessible components and design tokens.
• Conducted 35+ moderated usability testing sessions and translated findings into iterative product improvements.

EDUCATION
B.A. in Graphic Design & Human-Computer Interaction | UCLA | 2022
`,
    profile: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova.design@example.com',
      phone: '(555) 902-1234',
      location: 'Los Angeles, CA',
      title: 'UI/UX & Product Designer',
      summary: 'Product Designer with 3+ years experience building comprehensive Figma design systems, wireframes, and conducting user research for SaaS applications.',
      yearsOfExperience: 3.0,
      skills: [
        { name: 'Figma', category: 'Tools & DevOps', evidence: 'Built comprehensive design system with 250+ components', confidence: 'high' },
        { name: 'UI/UX Design', category: 'Domain Expertise', evidence: 'Designed enterprise B2B SaaS dashboard increasing engagement by 28%', confidence: 'high' },
        { name: 'Wireframing', category: 'Domain Expertise', evidence: 'Created low and high fidelity wireframes across all customer journeys', confidence: 'high' },
        { name: 'Prototyping', category: 'Domain Expertise', evidence: 'Interactive Figma micro-interaction prototypes for user tests', confidence: 'high' },
        { name: 'Design Systems', category: 'Domain Expertise', evidence: 'Managed design tokens and modular UI components', confidence: 'high' },
        { name: 'User Research', category: 'Domain Expertise', evidence: 'Conducted 35+ moderated usability testing sessions', confidence: 'high' },
        { name: 'HTML5', category: 'Frameworks & Libraries', evidence: 'Basic frontend literacy for engineer handoff', confidence: 'medium' },
        { name: 'CSS3', category: 'Frameworks & Libraries', evidence: 'Understands flexbox, grid, and design tokens in CSS', confidence: 'medium' },
      ],
      education: [
        {
          degree: 'B.A. in Graphic Design & HCI',
          institution: 'UCLA',
          graduationYear: 2022,
        },
      ],
      experience: [
        {
          title: 'Product Designer',
          company: 'Studio Helix',
          duration: 'March 2023 – Present',
          location: 'Los Angeles, CA',
          description: 'Designed B2B SaaS dashboard and built company design system.',
        },
      ],
      projects: [],
      certifications: [],
      strengths: ['Strong design system governance in Figma', 'Empathetic user research track record'],
      improvements: ['Highlight more quantitative business impact metrics', 'Explore motion design tools'],
      suggestedRoles: ['UI/UX Designer', 'Product Designer'],
      extractedAt: '2026-10-11T07:00:00Z',
      isSimulated: true,
    },
  },
];
