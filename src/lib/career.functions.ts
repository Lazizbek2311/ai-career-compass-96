import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

// ============================================================================
// Assessment input (must stay compatible with existing career-test.tsx form)
// ============================================================================

const AssessmentInput = z.object({
  fullName: z.string().optional().default(""),
  age: z.string().optional().default(""),
  country: z.string().optional().default(""),
  education: z.string().optional().default(""),
  grade: z.string().optional().default(""),
  interests: z.array(z.string()).default([]),
  subjects: z.array(z.string()).default([]),
  personality: z.record(z.string(), z.string()).default({}),
  skills: z.record(z.string(), z.number()).default({}),
  preferredCountry: z.string().optional().default(""),
  expectedSalary: z.string().optional().default(""),
  workMode: z.string().optional().default(""),
  companyType: z.string().optional().default(""),
  workLifeBalance: z.number().default(7),
});

type Assessment = z.infer<typeof AssessmentInput>;

const ReportSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  careers: z.array(
    z.object({
      title: z.string(),
      match: z.number(),
      whyItFits: z.string(),
      universityMajors: z.array(z.string()),
      technicalSkills: z.array(z.string()),
      softSkills: z.array(z.string()),
      salary: z.object({
        local: z.string(),
        usa: z.string(),
        europe: z.string(),
      }),
      futureDemand: z.string(),
      demandScore: z.number(),
      roadmap: z.array(
        z.object({
          phase: z.string(),
          duration: z.string(),
          focus: z.string(),
          milestones: z.array(z.string()),
        }),
      ),
    }),
  ),
});

export type CareerReport = z.infer<typeof ReportSchema>;

// ============================================================================
// Career library — each career has weighted traits used for scoring
// ============================================================================

type SalaryTier = "premium" | "high" | "mid" | "stable";

type CareerProfile = {
  title: string;
  interests: string[]; // any-of; higher overlap = higher score
  subjects: string[];
  skills: Partial<Record<SkillKey, number>>; // 0..1 weight of importance
  personality: Partial<Record<PersonalityKey, number>>; // -1..1 preference
  majors: string[];
  technicalSkills: string[];
  softSkills: string[];
  demand: {
    score: number;
    text: string;
  };
  tier: SalaryTier;
  learningTrack: "tech" | "design" | "science" | "business" | "medical" | "law" | "education" | "engineering";
};

type SkillKey =
  | "Communication"
  | "Leadership"
  | "Creativity"
  | "Programming"
  | "Mathematics"
  | "English"
  | "Teamwork"
  | "Critical Thinking";

// Personality question keys — matches career-test.tsx q0..q5
// q0: enjoys solving difficult problems
// q1: likes working with people
// q2: enjoys creating new ideas
// q3: prefers leading a team
// q4: enjoys analyzing data
// q5: likes building things
type PersonalityKey = "q0" | "q1" | "q2" | "q3" | "q4" | "q5";

const CAREER_LIBRARY: CareerProfile[] = [
  {
    title: "Software Engineer",
    interests: ["programming", "engineering", "ai"],
    subjects: ["cs", "math", "physics"],
    skills: { Programming: 1, "Critical Thinking": 0.8, Mathematics: 0.6, Teamwork: 0.5, English: 0.5 },
    personality: { q0: 1, q5: 1, q4: 0.5 },
    majors: ["Computer Science", "Software Engineering", "Information Systems"],
    technicalSkills: ["TypeScript", "Data Structures", "APIs", "Git", "Databases", "Testing"],
    softSkills: ["Problem Solving", "Team Communication", "Ownership", "Debugging Patience"],
    demand: { score: 94, text: "Consistently one of the highest-demand roles worldwide across every industry." },
    tier: "high",
    learningTrack: "tech",
  },
  {
    title: "AI Engineer",
    interests: ["ai", "programming", "math", "science"],
    subjects: ["cs", "math", "physics"],
    skills: { Programming: 1, Mathematics: 1, "Critical Thinking": 0.9, English: 0.6 },
    personality: { q0: 1, q4: 1, q5: 0.6 },
    majors: ["Artificial Intelligence", "Computer Science", "Data Science", "Applied Mathematics"],
    technicalSkills: ["Python", "PyTorch", "Machine Learning", "LLMs", "Model Evaluation", "MLOps"],
    softSkills: ["Research Mindset", "Persistence", "Communication", "Critical Thinking"],
    demand: { score: 98, text: "Demand is exploding as every industry adopts AI copilots and automation." },
    tier: "premium",
    learningTrack: "tech",
  },
  {
    title: "Data Scientist",
    interests: ["ai", "math", "science", "business"],
    subjects: ["math", "cs", "economics", "physics"],
    skills: { Mathematics: 1, Programming: 0.8, "Critical Thinking": 0.9, Communication: 0.6 },
    personality: { q0: 0.8, q4: 1, q1: 0.4 },
    majors: ["Data Science", "Statistics", "Computer Science", "Economics"],
    technicalSkills: ["Python", "SQL", "Statistics", "Pandas", "Visualization", "A/B Testing"],
    softSkills: ["Storytelling", "Business Thinking", "Attention to Detail", "Curiosity"],
    demand: { score: 93, text: "Every company that collects data needs people who can turn it into decisions." },
    tier: "high",
    learningTrack: "tech",
  },
  {
    title: "Cybersecurity Engineer",
    interests: ["cybersecurity", "programming", "engineering"],
    subjects: ["cs", "math"],
    skills: { Programming: 0.8, "Critical Thinking": 1, English: 0.6, Teamwork: 0.5 },
    personality: { q0: 1, q4: 0.7 },
    majors: ["Cybersecurity", "Computer Science", "Network Engineering"],
    technicalSkills: ["Networking", "Linux", "Cryptography", "Cloud Security", "Python Scripting", "Incident Response"],
    softSkills: ["Attention to Detail", "Ethical Judgment", "Calm Under Pressure", "Communication"],
    demand: { score: 92, text: "Rising cyber threats keep security roles in critical global shortage." },
    tier: "high",
    learningTrack: "tech",
  },
  {
    title: "Cloud / DevOps Engineer",
    interests: ["programming", "engineering", "cybersecurity"],
    subjects: ["cs"],
    skills: { Programming: 0.8, "Critical Thinking": 0.8, Teamwork: 0.6 },
    personality: { q0: 0.8, q5: 0.8 },
    majors: ["Computer Science", "Information Systems", "Software Engineering"],
    technicalSkills: ["Linux", "AWS/GCP", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    softSkills: ["Reliability", "Systems Thinking", "Ownership", "Documentation"],
    demand: { score: 90, text: "Cloud-first architectures make DevOps a permanent core role." },
    tier: "high",
    learningTrack: "tech",
  },
  {
    title: "UX/UI Designer",
    interests: ["design", "programming", "marketing", "psychology"],
    subjects: ["literature", "english"],
    skills: { Creativity: 1, Communication: 0.8, Teamwork: 0.7, English: 0.6 },
    personality: { q2: 1, q1: 0.7, q3: 0.3 },
    majors: ["Interaction Design", "Graphic Design", "Human-Computer Interaction", "Psychology"],
    technicalSkills: ["Figma", "Prototyping", "Design Systems", "User Research", "Accessibility", "Wireframing"],
    softSkills: ["Empathy", "Storytelling", "Collaboration", "Iteration"],
    demand: { score: 86, text: "Digital products keep multiplying, and each one needs great UX." },
    tier: "mid",
    learningTrack: "design",
  },
  {
    title: "Graphic Designer",
    interests: ["design", "marketing"],
    subjects: ["literature"],
    skills: { Creativity: 1, Communication: 0.6 },
    personality: { q2: 1, q1: 0.3 },
    majors: ["Graphic Design", "Visual Communication", "Fine Arts"],
    technicalSkills: ["Illustrator", "Photoshop", "Typography", "Brand Systems", "Layout", "Color Theory"],
    softSkills: ["Creativity", "Attention to Detail", "Client Communication", "Time Management"],
    demand: { score: 78, text: "Brand and content-heavy industries keep visual designers in steady demand." },
    tier: "mid",
    learningTrack: "design",
  },
  {
    title: "Game Developer",
    interests: ["programming", "design", "ai"],
    subjects: ["cs", "math", "physics"],
    skills: { Programming: 1, Creativity: 0.8, Mathematics: 0.7 },
    personality: { q0: 0.8, q2: 0.9, q5: 1 },
    majors: ["Computer Science", "Game Development", "Interactive Media"],
    technicalSkills: ["C#", "Unity", "Unreal", "3D Math", "Shaders", "Game AI"],
    softSkills: ["Creativity", "Collaboration", "Persistence", "Player Empathy"],
    demand: { score: 82, text: "Gaming and interactive media keep expanding into education and enterprise." },
    tier: "mid",
    learningTrack: "tech",
  },
  {
    title: "Product Manager",
    interests: ["business", "programming", "design", "marketing"],
    subjects: ["economics", "english", "cs"],
    skills: { Leadership: 1, Communication: 1, "Critical Thinking": 0.8, English: 0.7 },
    personality: { q1: 0.9, q3: 1, q2: 0.7 },
    majors: ["Business Administration", "Computer Science", "Information Systems"],
    technicalSkills: ["Analytics", "Roadmapping", "SQL Basics", "A/B Testing", "Wireframing", "AI Product Fundamentals"],
    softSkills: ["Leadership", "Prioritization", "Communication", "Decision Making"],
    demand: { score: 88, text: "Every software company competes on product quality and needs PM leadership." },
    tier: "high",
    learningTrack: "business",
  },
  {
    title: "Business Analyst",
    interests: ["business", "finance", "math"],
    subjects: ["economics", "math"],
    skills: { "Critical Thinking": 1, Communication: 0.8, Mathematics: 0.7 },
    personality: { q4: 1, q1: 0.6 },
    majors: ["Business Analytics", "Economics", "Information Systems", "Finance"],
    technicalSkills: ["Excel", "SQL", "Power BI/Tableau", "Process Mapping", "Requirements", "Statistics"],
    softSkills: ["Analytical Thinking", "Stakeholder Communication", "Documentation", "Empathy"],
    demand: { score: 84, text: "Companies increasingly rely on analysts to guide data-driven decisions." },
    tier: "mid",
    learningTrack: "business",
  },
  {
    title: "Financial Analyst",
    interests: ["finance", "business", "math"],
    subjects: ["economics", "math"],
    skills: { Mathematics: 1, "Critical Thinking": 0.9, Communication: 0.6 },
    personality: { q4: 1, q0: 0.7 },
    majors: ["Finance", "Economics", "Accounting", "Business Administration"],
    technicalSkills: ["Financial Modeling", "Excel", "Valuation", "Accounting Basics", "SQL", "Bloomberg"],
    softSkills: ["Attention to Detail", "Ethical Judgment", "Communication", "Discipline"],
    demand: { score: 82, text: "Finance remains a foundational, globally portable career track." },
    tier: "high",
    learningTrack: "business",
  },
  {
    title: "Economist",
    interests: ["finance", "business", "math", "science"],
    subjects: ["economics", "math", "history"],
    skills: { Mathematics: 1, "Critical Thinking": 1, Communication: 0.7, English: 0.7 },
    personality: { q0: 0.8, q4: 1 },
    majors: ["Economics", "Applied Mathematics", "Public Policy"],
    technicalSkills: ["Econometrics", "Statistics", "R/Python", "Data Analysis", "Modeling", "Research"],
    softSkills: ["Analytical Writing", "Research", "Critical Thinking", "Communication"],
    demand: { score: 80, text: "Governments, banks, and think tanks all need rigorous economic analysis." },
    tier: "mid",
    learningTrack: "business",
  },
  {
    title: "Marketing Specialist",
    interests: ["marketing", "business", "design", "psychology"],
    subjects: ["english", "literature", "economics"],
    skills: { Creativity: 0.9, Communication: 1, English: 0.8, Teamwork: 0.7 },
    personality: { q1: 1, q2: 0.8, q3: 0.6 },
    majors: ["Marketing", "Communications", "Business Administration"],
    technicalSkills: ["SEO", "Content", "Analytics", "Paid Ads", "Social Strategy", "Copywriting"],
    softSkills: ["Storytelling", "Empathy", "Collaboration", "Adaptability"],
    demand: { score: 80, text: "Digital marketing keeps growing as attention shifts online." },
    tier: "mid",
    learningTrack: "business",
  },
  {
    title: "Doctor",
    interests: ["medicine", "science"],
    subjects: ["biology", "chemistry"],
    skills: { "Critical Thinking": 1, Communication: 0.9, English: 0.7 },
    personality: { q0: 0.9, q1: 1 },
    majors: ["Medicine (MD)", "Biology", "Biomedical Sciences"],
    technicalSkills: ["Anatomy", "Diagnostics", "Pharmacology", "Clinical Reasoning", "Patient Care", "Research"],
    softSkills: ["Empathy", "Resilience", "Communication", "Ethical Judgment"],
    demand: { score: 92, text: "Healthcare demand keeps rising with aging populations everywhere." },
    tier: "premium",
    learningTrack: "medical",
  },
  {
    title: "Biomedical Researcher",
    interests: ["medicine", "science", "ai"],
    subjects: ["biology", "chemistry", "math"],
    skills: { "Critical Thinking": 1, Mathematics: 0.7, English: 0.7 },
    personality: { q0: 1, q4: 0.9 },
    majors: ["Biomedical Sciences", "Biology", "Biotechnology", "Chemistry"],
    technicalSkills: ["Lab Techniques", "Statistics", "Research Design", "Bioinformatics", "Writing", "Data Analysis"],
    softSkills: ["Curiosity", "Discipline", "Communication", "Collaboration"],
    demand: { score: 84, text: "AI-driven drug discovery and genomics are creating a new wave of research jobs." },
    tier: "mid",
    learningTrack: "science",
  },
  {
    title: "Lawyer",
    interests: ["law", "business"],
    subjects: ["history", "literature", "english"],
    skills: { Communication: 1, "Critical Thinking": 1, English: 1 },
    personality: { q1: 0.9, q3: 0.8, q0: 0.7 },
    majors: ["Law", "Political Science", "International Relations"],
    technicalSkills: ["Legal Research", "Writing", "Contract Drafting", "Litigation Basics", "Regulation", "Negotiation"],
    softSkills: ["Argumentation", "Ethical Judgment", "Discipline", "Empathy"],
    demand: { score: 78, text: "Regulation and cross-border business keep the legal field stable and lucrative." },
    tier: "high",
    learningTrack: "law",
  },
  {
    title: "Teacher / Educator",
    interests: ["teaching", "psychology", "science"],
    subjects: ["literature", "english", "history", "math", "biology"],
    skills: { Communication: 1, Teamwork: 0.8, English: 0.7, Creativity: 0.6 },
    personality: { q1: 1, q3: 0.7, q2: 0.6 },
    majors: ["Education", "Pedagogy", "Subject-specific BEd"],
    technicalSkills: ["Curriculum Design", "Assessment", "EdTech Tools", "Classroom Management", "Public Speaking", "Research"],
    softSkills: ["Patience", "Empathy", "Communication", "Adaptability"],
    demand: { score: 76, text: "Great teachers stay in permanent demand, especially in STEM and languages." },
    tier: "stable",
    learningTrack: "education",
  },
  {
    title: "Psychologist",
    interests: ["psychology", "medicine", "teaching"],
    subjects: ["biology", "literature", "english"],
    skills: { Communication: 1, "Critical Thinking": 0.9, English: 0.7 },
    personality: { q1: 1, q0: 0.7 },
    majors: ["Psychology", "Clinical Psychology", "Cognitive Science"],
    technicalSkills: ["Assessment", "Therapy Methods", "Statistics", "Research", "Interviewing", "Documentation"],
    softSkills: ["Empathy", "Active Listening", "Ethical Judgment", "Patience"],
    demand: { score: 82, text: "Mental-health awareness has made psychology one of the fastest-growing fields." },
    tier: "mid",
    learningTrack: "medical",
  },
  {
    title: "Architect",
    interests: ["design", "engineering", "science"],
    subjects: ["math", "physics", "literature"],
    skills: { Creativity: 1, Mathematics: 0.7, "Critical Thinking": 0.8 },
    personality: { q2: 1, q5: 0.9, q0: 0.5 },
    majors: ["Architecture", "Urban Design", "Civil Engineering"],
    technicalSkills: ["AutoCAD", "Revit", "3D Modeling", "Structural Basics", "Sustainability", "Project Planning"],
    softSkills: ["Creativity", "Client Communication", "Project Management", "Attention to Detail"],
    demand: { score: 76, text: "Sustainable cities and urban growth keep architecture globally relevant." },
    tier: "mid",
    learningTrack: "engineering",
  },
  {
    title: "Mechanical Engineer",
    interests: ["engineering", "robotics", "science"],
    subjects: ["physics", "math"],
    skills: { Mathematics: 1, "Critical Thinking": 0.9, Programming: 0.4 },
    personality: { q0: 0.9, q5: 1, q4: 0.6 },
    majors: ["Mechanical Engineering", "Mechatronics", "Aerospace Engineering"],
    technicalSkills: ["CAD", "Thermodynamics", "Materials", "MATLAB", "Manufacturing", "Simulation"],
    softSkills: ["Problem Solving", "Teamwork", "Documentation", "Persistence"],
    demand: { score: 80, text: "Manufacturing, energy, and robotics keep mechanical engineers essential." },
    tier: "mid",
    learningTrack: "engineering",
  },
  {
    title: "Electrical Engineer",
    interests: ["engineering", "robotics", "science", "programming"],
    subjects: ["physics", "math", "cs"],
    skills: { Mathematics: 1, "Critical Thinking": 0.9, Programming: 0.6 },
    personality: { q0: 1, q5: 0.9, q4: 0.7 },
    majors: ["Electrical Engineering", "Electronics", "Robotics"],
    technicalSkills: ["Circuits", "Embedded Systems", "Signals", "MATLAB", "PCB Design", "Microcontrollers"],
    softSkills: ["Analytical Thinking", "Teamwork", "Precision", "Documentation"],
    demand: { score: 84, text: "EV, renewable energy, and IoT are driving strong hiring for EE talent." },
    tier: "high",
    learningTrack: "engineering",
  },
  {
    title: "Robotics Engineer",
    interests: ["robotics", "engineering", "ai", "programming"],
    subjects: ["physics", "math", "cs"],
    skills: { Programming: 1, Mathematics: 1, "Critical Thinking": 0.9 },
    personality: { q0: 1, q5: 1, q4: 0.7 },
    majors: ["Robotics", "Mechatronics", "Electrical Engineering", "Computer Science"],
    technicalSkills: ["ROS", "Control Systems", "Computer Vision", "Embedded C++", "Kinematics", "Simulation"],
    softSkills: ["Systems Thinking", "Persistence", "Collaboration", "Documentation"],
    demand: { score: 88, text: "Automation and humanoid robotics are creating a fresh global talent race." },
    tier: "high",
    learningTrack: "engineering",
  },
  {
    title: "Civil Engineer",
    interests: ["engineering", "science"],
    subjects: ["physics", "math", "geography"],
    skills: { Mathematics: 0.9, "Critical Thinking": 0.8, Teamwork: 0.6 },
    personality: { q5: 1, q0: 0.7 },
    majors: ["Civil Engineering", "Structural Engineering", "Urban Planning"],
    technicalSkills: ["Structural Analysis", "AutoCAD", "Materials", "Surveying", "Project Planning", "Codes"],
    softSkills: ["Reliability", "Teamwork", "Communication", "Ownership"],
    demand: { score: 74, text: "Infrastructure and green building keep civil engineering steadily needed." },
    tier: "mid",
    learningTrack: "engineering",
  },
  {
    title: "Content Creator / Journalist",
    interests: ["marketing", "teaching", "design"],
    subjects: ["literature", "english", "history"],
    skills: { Communication: 1, English: 1, Creativity: 0.9 },
    personality: { q1: 0.9, q2: 1 },
    majors: ["Journalism", "Communications", "Media Studies"],
    technicalSkills: ["Writing", "Editing", "SEO", "Video Basics", "Social Strategy", "Interviewing"],
    softSkills: ["Storytelling", "Curiosity", "Discipline", "Adaptability"],
    demand: { score: 72, text: "Creator economy and independent media keep expanding globally." },
    tier: "mid",
    learningTrack: "business",
  },
  {
    title: "Environmental Scientist",
    interests: ["science", "engineering"],
    subjects: ["biology", "chemistry", "geography"],
    skills: { "Critical Thinking": 1, Mathematics: 0.6, English: 0.7 },
    personality: { q0: 0.8, q4: 0.9 },
    majors: ["Environmental Science", "Ecology", "Earth Sciences"],
    technicalSkills: ["Field Research", "GIS", "Statistics", "Lab Work", "Modeling", "Reporting"],
    softSkills: ["Analytical Thinking", "Communication", "Persistence", "Collaboration"],
    demand: { score: 78, text: "Climate action makes sustainability roles one of the fastest-growing categories." },
    tier: "mid",
    learningTrack: "science",
  },
];

// ============================================================================
// Scoring
// ============================================================================

const ANSWER_TO_VALUE: Record<string, number> = {
  "Strongly Agree": 2,
  Agree: 1,
  Neutral: 0,
  Disagree: -1,
  "Strongly Disagree": -2,
};

function personalityValue(assessment: Assessment, key: PersonalityKey): number {
  const raw = assessment.personality[key];
  if (!raw) return 0;
  return ANSWER_TO_VALUE[raw] ?? 0;
}

function skillValue(assessment: Assessment, key: SkillKey): number {
  // Skills are stored on a 1..5 or 0..10 scale by the test; normalise to 0..1
  const raw = assessment.skills[key];
  if (typeof raw !== "number" || !Number.isFinite(raw)) return 0.4;
  if (raw > 10) return 1;
  if (raw >= 0 && raw <= 10) return Math.max(0, Math.min(1, raw / 10));
  return 0.4;
}

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

type ScoredCareer = {
  profile: CareerProfile;
  score: number;
  matchPct: number;
  interestOverlap: string[];
  subjectOverlap: string[];
  skillOverlap: SkillKey[];
  personalityOverlap: PersonalityKey[];
};

function scoreCareers(assessment: Assessment): ScoredCareer[] {
  const seed = hashString(
    `${assessment.fullName}|${assessment.age}|${assessment.country}|${assessment.interests.join(",")}|${assessment.subjects.join(",")}|${JSON.stringify(assessment.skills)}|${JSON.stringify(assessment.personality)}`,
  );

  const interestSet = new Set(assessment.interests);
  const subjectSet = new Set(assessment.subjects);

  const scored = CAREER_LIBRARY.map((profile, index) => {
    let score = 0;
    const interestOverlap: string[] = [];
    const subjectOverlap: string[] = [];
    const skillOverlap: SkillKey[] = [];
    const personalityOverlap: PersonalityKey[] = [];

    // Interests: up to 5 x 6 = 30 points
    for (const it of profile.interests) {
      if (interestSet.has(it)) {
        score += 6;
        interestOverlap.push(it);
      }
    }
    // Subjects: up to ~9 points
    for (const sub of profile.subjects) {
      if (subjectSet.has(sub)) {
        score += 3;
        subjectOverlap.push(sub);
      }
    }
    // Skills: weighted, up to ~15 points
    for (const [key, weight] of Object.entries(profile.skills) as [SkillKey, number][]) {
      const value = skillValue(assessment, key);
      score += value * weight * 5;
      if (value >= 0.6 && weight >= 0.6) skillOverlap.push(key);
    }
    // Personality: signed, up to ~12 points
    for (const [key, weight] of Object.entries(profile.personality) as [PersonalityKey, number][]) {
      const v = personalityValue(assessment, key); // -2..2
      score += v * weight * 1.5;
      if (v > 0 && weight > 0) personalityOverlap.push(key);
    }

    // Goals nudges
    if (assessment.workMode === "Remote" && profile.learningTrack === "tech") score += 2;
    if (assessment.workMode === "Office" && (profile.learningTrack === "medical" || profile.learningTrack === "engineering" || profile.learningTrack === "law")) score += 1.5;
    if (assessment.companyType === "Startup" && (profile.title.includes("Product") || profile.learningTrack === "tech" || profile.learningTrack === "design")) score += 1;
    if (assessment.companyType === "Big Company" && (profile.learningTrack === "business" || profile.learningTrack === "law")) score += 1;

    // Expected salary nudge
    const expected = Number.parseFloat(assessment.expectedSalary || "");
    if (Number.isFinite(expected) && expected > 0) {
      const tierValue = profile.tier === "premium" ? 6000 : profile.tier === "high" ? 4000 : profile.tier === "mid" ? 2500 : 1500;
      const distance = Math.abs(expected - tierValue) / 1000;
      score -= Math.min(distance * 0.4, 4);
    }

    // Deterministic per-user tiebreak (tiny)
    const jitter = ((seed + index * 2654435761) % 1000) / 5000; // 0..0.2
    score += jitter;

    return { profile, score, interestOverlap, subjectOverlap, skillOverlap, personalityOverlap, matchPct: 0 };
  });

  scored.sort((a, b) => b.score - a.score);

  // Convert raw score to a compatibility % (relative + absolute floors/ceilings).
  const top = scored[0]?.score ?? 1;
  const bottom = scored[scored.length - 1]?.score ?? 0;
  const range = Math.max(top - bottom, 1);
  for (const item of scored) {
    const normalised = (item.score - bottom) / range; // 0..1
    // Anchor top ~98%, floor ~55%
    item.matchPct = Math.round(55 + normalised * 43);
  }
  // Ensure the top career reads as a strong match
  if (scored[0]) scored[0].matchPct = Math.max(scored[0].matchPct, 92);

  return scored;
}

// ============================================================================
// Personalized narrative builders
// ============================================================================

const INTEREST_LABEL: Record<string, string> = {
  ai: "artificial intelligence",
  programming: "programming",
  math: "mathematics",
  business: "business",
  medicine: "medicine",
  engineering: "engineering",
  design: "design",
  finance: "finance",
  marketing: "marketing",
  teaching: "teaching",
  psychology: "psychology",
  law: "law",
  science: "science",
  cybersecurity: "cybersecurity",
  robotics: "robotics",
};

const SUBJECT_LABEL: Record<string, string> = {
  math: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  english: "English",
  history: "History",
  geography: "Geography",
  cs: "Computer Science",
  economics: "Economics",
  literature: "Literature",
};

const PERSONALITY_LABEL: Record<PersonalityKey, string> = {
  q0: "your appetite for hard problems",
  q1: "your comfort working with people",
  q2: "your drive to create new ideas",
  q3: "your instinct for leading teams",
  q4: "your love of analyzing data",
  q5: "your enjoyment of building things",
};

function joinList(items: string[], max = 3): string {
  const trimmed = items.slice(0, max);
  if (trimmed.length === 0) return "";
  if (trimmed.length === 1) return trimmed[0];
  if (trimmed.length === 2) return `${trimmed[0]} and ${trimmed[1]}`;
  return `${trimmed.slice(0, -1).join(", ")}, and ${trimmed[trimmed.length - 1]}`;
}

function buildWhyItFits(sc: ScoredCareer, a: Assessment): string {
  const parts: string[] = [];
  if (sc.interestOverlap.length) {
    parts.push(
      `it lines up with your interest in ${joinList(sc.interestOverlap.map((i) => INTEREST_LABEL[i] ?? i))}`,
    );
  }
  if (sc.subjectOverlap.length) {
    parts.push(
      `it leans on subjects you already enjoy — ${joinList(sc.subjectOverlap.map((s) => SUBJECT_LABEL[s] ?? s))}`,
    );
  }
  if (sc.skillOverlap.length) {
    parts.push(`your strongest skills (${joinList(sc.skillOverlap.slice(0, 3))}) are exactly what this role rewards`);
  }
  if (sc.personalityOverlap.length) {
    parts.push(joinList(sc.personalityOverlap.map((k) => PERSONALITY_LABEL[k])));
  }
  const country = a.preferredCountry || a.country || "your target market";
  const opening = `${sc.profile.title} is a strong fit for you because`;
  const body = parts.length ? parts.join("; ") : "your overall profile aligns well with the day-to-day of this role";
  return `${opening} ${body}. In ${country}, this career also matches your goals around work mode (${a.workMode || "flexible"}) and company type (${a.companyType || "no strong preference"}).`;
}

function buildStrengths(a: Assessment): string[] {
  const items: string[] = [];
  const orderedSkills = (Object.keys(a.skills) as SkillKey[])
    .filter((k) => typeof a.skills[k] === "number")
    .sort((x, y) => (a.skills[y] as number) - (a.skills[x] as number));
  const topSkills = orderedSkills.slice(0, 3);
  if (topSkills.length) {
    items.push(`Solid self-rated ${joinList(topSkills)} — a strong base to build on.`);
  }
  if (a.interests.length >= 3) {
    items.push(`You have clear interests across ${joinList(a.interests.map((i) => INTEREST_LABEL[i] ?? i))}, which makes it easier to specialise.`);
  }
  const strongPersonality = (Object.keys(a.personality) as PersonalityKey[])
    .filter((k) => (ANSWER_TO_VALUE[a.personality[k]] ?? 0) >= 1);
  if (strongPersonality.length) {
    items.push(`You show ${joinList(strongPersonality.map((k) => PERSONALITY_LABEL[k]))}, which top employers value.`);
  }
  if (a.subjects.length) {
    items.push(`Your favourite subjects (${joinList(a.subjects.map((s) => SUBJECT_LABEL[s] ?? s))}) already point toward high-demand fields.`);
  }
  if (items.length < 4) {
    items.push("Motivation to align education choices with real career and salary outcomes.");
  }
  return items.slice(0, 5);
}

function buildWeaknesses(a: Assessment): string[] {
  const items: string[] = [];
  const orderedSkills = (Object.keys(a.skills) as SkillKey[])
    .filter((k) => typeof a.skills[k] === "number")
    .sort((x, y) => (a.skills[x] as number) - (a.skills[y] as number));
  const lowSkills = orderedSkills.slice(0, 2);
  if (lowSkills.length) {
    items.push(`Room to grow in ${joinList(lowSkills)} — a focused 8–12 week plan can move the needle fast.`);
  }
  const weakPersonality = (Object.keys(a.personality) as PersonalityKey[])
    .filter((k) => (ANSWER_TO_VALUE[a.personality[k]] ?? 0) <= -1);
  if (weakPersonality.length) {
    items.push(`Watch out for ${joinList(weakPersonality.map((k) => PERSONALITY_LABEL[k]))} — build habits that stretch this muscle.`);
  }
  if ((a.skills["English"] ?? 5) < 6) {
    items.push("Advanced English communication needs polishing to unlock international roles.");
  }
  items.push("Build a small public portfolio to prove practical ability, not just theory.");
  items.push("Practice interview storytelling — how you explain a project matters as much as the project itself.");
  return items.slice(0, 4);
}

function buildSummary(top: ScoredCareer, a: Assessment): string {
  const country = a.country || "Uzbekistan";
  const target = a.preferredCountry || "international opportunities";
  const interests = a.interests.length ? joinList(a.interests.map((i) => INTEREST_LABEL[i] ?? i), 4) : "modern, high-growth fields";
  const subjects = a.subjects.length ? joinList(a.subjects.map((s) => SUBJECT_LABEL[s] ?? s), 3) : "quantitative and analytical topics";
  return `Based on your interests in ${interests}, your favourite subjects (${subjects}), and your goal of pursuing ${target} from ${country}, your profile is strongest for a path in ${top.profile.title}. This report ranks your top 5 careers by an AI compatibility score, then gives you a personalised roadmap, skill plan, and salary outlook for each. Use it as a decision map — not a verdict.`;
}

function buildRoadmap(sc: ScoredCareer): CareerReport["careers"][number]["roadmap"] {
  const t = sc.profile.title;
  const track = sc.profile.learningTrack;
  const first = track === "medical"
    ? { phase: "Foundations", duration: "0-6 months", focus: `Build strong biology, chemistry, and English foundations for ${t}.`, milestones: ["Master school-level biology and chemistry", "Improve academic English", "Shadow a professional or volunteer at a clinic"] }
    : track === "law"
      ? { phase: "Foundations", duration: "0-4 months", focus: `Build reading, writing, and reasoning stamina for ${t}.`, milestones: ["Read one legal or policy article per week", "Practice structured writing", "Follow current events daily"] }
      : track === "design"
        ? { phase: "Foundations", duration: "0-3 months", focus: `Build visual literacy and tool basics for ${t}.`, milestones: ["Complete a Figma or design fundamentals course", "Redesign 3 real screens", "Start a design log"] }
        : track === "business"
          ? { phase: "Foundations", duration: "0-3 months", focus: `Learn the language of business relevant to ${t}.`, milestones: ["Master Excel and basic finance", "Read 2 business classics", "Start following industry newsletters"] }
          : { phase: "Foundations", duration: "0-3 months", focus: `Build core technical fundamentals for ${t}.`, milestones: ["Learn or refresh core programming or math skills", "Build 3 small practice projects", "Set up a public portfolio"] };

  return [
    first,
    {
      phase: "Core Skills",
      duration: "3-8 months",
      focus: `Get productive on the day-to-day skills a ${t} actually uses.`,
      milestones: sc.profile.technicalSkills.slice(0, 3).map((s) => `Ship a project using ${s}`),
    },
    {
      phase: "Portfolio & Depth",
      duration: "8-14 months",
      focus: `Build proof-of-work that stands out for ${t} roles.`,
      milestones: ["Ship one substantial capstone project", "Get feedback from a mentor in the field", "Document everything publicly"],
    },
    {
      phase: "Career Launch",
      duration: "14-18 months",
      focus: `Convert learning into internships, entry roles, or admissions for ${t}.`,
      milestones: ["Prepare a targeted CV and portfolio", "Practice interview storytelling", "Apply to at least 10 opportunities"],
    },
  ];
}

const SALARY_TABLE: Record<SalaryTier, { local: string; usa: string; europe: string }> = {
  premium: { local: "UZS 220M–520M / year", usa: "USD 130K–240K / year", europe: "EUR 75K–150K / year" },
  high:    { local: "UZS 150M–380M / year", usa: "USD 95K–180K / year",  europe: "EUR 55K–120K / year" },
  mid:     { local: "UZS 90M–240M / year",  usa: "USD 70K–130K / year",  europe: "EUR 40K–85K / year"  },
  stable:  { local: "UZS 60M–160M / year",  usa: "USD 45K–90K / year",   europe: "EUR 28K–60K / year"  },
};

function buildCareerEntry(sc: ScoredCareer, a: Assessment): CareerReport["careers"][number] {
  const salary = SALARY_TABLE[sc.profile.tier];
  const country = a.country || "Uzbekistan";
  return {
    title: sc.profile.title,
    match: sc.matchPct,
    whyItFits: buildWhyItFits(sc, a),
    universityMajors: sc.profile.majors,
    technicalSkills: sc.profile.technicalSkills,
    softSkills: sc.profile.softSkills,
    salary: {
      local: `${country}: ${salary.local}`,
      usa: salary.usa,
      europe: salary.europe,
    },
    futureDemand: sc.profile.demand.text,
    demandScore: sc.profile.demand.score,
    roadmap: buildRoadmap(sc),
  };
}

function buildDeterministicReport(a: Assessment): CareerReport {
  const ranked = scoreCareers(a);
  const top5 = ranked.slice(0, 5);
  const report: CareerReport = {
    summary: buildSummary(top5[0], a),
    strengths: buildStrengths(a),
    weaknesses: buildWeaknesses(a),
    careers: top5.map((sc) => buildCareerEntry(sc, a)),
  };
  return ReportSchema.parse(report);
}

// ============================================================================
// Optional AI polish for the summary paragraph (never affects ranking)
// ============================================================================

async function polishSummaryWithAI(report: CareerReport, a: Assessment): Promise<CareerReport> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return report;
  try {
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `Rewrite the following career-report summary in ONE polished, motivating paragraph (max 90 words). Keep the facts exactly. Do not add markdown. Do not add labels. Return only the paragraph.

USER: ${a.fullName || "Student"} from ${a.country || "Uzbekistan"}. Target: ${a.preferredCountry || "international"}. Interests: ${a.interests.join(", ") || "n/a"}. Top career: ${report.careers[0]?.title}.

ORIGINAL SUMMARY:
${report.summary}`;
    const result = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt,
      temperature: 0.4,
      maxOutputTokens: 300,
    });
    const cleaned = result.text.trim().replace(/^["'`]+|["'`]+$/g, "");
    if (cleaned.length > 40) {
      return { ...report, summary: cleaned };
    }
  } catch (error) {
    console.warn("[CareerAI] AI summary polish failed, using deterministic summary.", error);
  }
  return report;
}

// ============================================================================
// Server function
// ============================================================================

export const analyzeCareer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssessmentInput.parse(input))
  .handler(async ({ data }) => {
    const report = buildDeterministicReport(data);
    console.info("[CareerAI analyzeCareer] Deterministic ranking complete", {
      top: report.careers.map((c) => ({ title: c.title, match: c.match })),
      interestsCount: data.interests.length,
      subjectsCount: data.subjects.length,
      skillsCount: Object.keys(data.skills).length,
    });
    const polished = await polishSummaryWithAI(report, data);
    return {
      report: polished,
      generatedAt: new Date().toISOString(),
      user: { name: data.fullName, country: data.country },
      source: "engine" as const,
    };
  });
