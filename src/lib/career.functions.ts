import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

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

const REQUIRED_REPORT_STRUCTURE = `{
  "summary": "string",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "careers": [
    {
      "title": "string",
      "match": 98,
      "whyItFits": "string",
      "universityMajors": ["string", "string", "string"],
      "technicalSkills": ["string", "string", "string", "string"],
      "softSkills": ["string", "string", "string", "string"],
      "salary": {
        "local": "string",
        "usa": "string",
        "europe": "string"
      },
      "futureDemand": "string",
      "demandScore": 92,
      "roadmap": [
        {
          "phase": "string",
          "duration": "string",
          "focus": "string",
          "milestones": ["string", "string", "string"]
        }
      ]
    }
  ]
}`;

function buildAnalysisPrompt(data: z.infer<typeof AssessmentInput>, simplified = false) {
  const country = data.country || "Uzbekistan";
  const preferredCountry = data.preferredCountry || "USA or Europe";

  if (simplified) {
    return `Return ONLY valid JSON. No markdown. No explanation.

You must generate a CareerAI career report using EXACTLY this JSON structure and EXACTLY these property names:
${REQUIRED_REPORT_STRUCTURE}

Hard rules:
- Top-level keys must be exactly: summary, strengths, weaknesses, careers.
- Generate exactly 5 career objects in careers.
- Every career object must include exactly: title, match, whyItFits, universityMajors, technicalSkills, softSkills, salary, futureDemand, demandScore, roadmap.
- salary must include exactly: local, usa, europe.
- roadmap items must include exactly: phase, duration, focus, milestones.
- match and demandScore must be raw JSON numbers, not strings, not percentages.
- All arrays must contain strings except careers and roadmap.
- Do not return null values. Do not add extra keys.

User assessment JSON:
${JSON.stringify(data, null, 2)}`;
  }

  return `You are CareerAI, an expert AI career counselor for students and professionals. Analyze the user's assessment and generate a personalized career report.

Return ONLY a valid JSON object. Do not include markdown fences, comments, headings, explanations, or text before/after the JSON.

The JSON output MUST match this exact structure, property names, and value types:
${REQUIRED_REPORT_STRUCTURE}

Schema alignment rules:
1. Top-level object keys: summary, strengths, weaknesses, careers.
2. summary: one professional personalized paragraph as a string.
3. strengths: array of 4-6 strings about this user's strengths.
4. weaknesses: array of 3-5 strings about realistic improvement areas for this user.
5. careers: array of exactly 5 distinct career objects, ranked by match descending.
6. Each career object keys: title, match, whyItFits, universityMajors, technicalSkills, softSkills, salary, futureDemand, demandScore, roadmap.
7. title: career name string.
8. match: raw JSON number from 70 to 99. Do not write "98%".
9. whyItFits: string explaining why this career matches the user's interests, subjects, personality, skills, and goals.
10. universityMajors: array of 3-5 major names as strings.
11. technicalSkills: array of 5-7 required technical skills as strings.
12. softSkills: array of 4-6 required soft skills as strings.
13. salary: object with exactly local, usa, europe as strings.
14. salary.local: realistic annual range in ${country}, using local currency where possible.
15. salary.usa: realistic annual range in USD.
16. salary.europe: realistic annual range in EUR.
17. futureDemand: 1-2 sentence demand outlook string.
18. demandScore: raw JSON number from 70 to 99. Do not write "92/100".
19. roadmap: array of 3-5 phase objects.
20. Each roadmap phase keys: phase, duration, focus, milestones.
21. milestones: array of 3-5 concrete milestone strings.
22. Do not add fields such as career, percentage, reason, salaries, localSalary, internationalSalary, requiredSkills, phases, steps, or recommendation.
23. Do not omit any required field. Do not use null.

Personalization requirements:
- Reference the user's selected interests: ${data.interests.join(", ") || "not specified"}.
- Reference the user's favorite subjects: ${data.subjects.join(", ") || "not specified"}.
- Consider personality answers and skill ratings.
- Consider preferred country: ${preferredCountry}.
- Be specific, practical, premium, and motivational.

USER ASSESSMENT JSON:
${JSON.stringify(data, null, 2)}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function preview(value: string, maxLength = 2500) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}…[truncated ${value.length - maxLength} chars]` : value;
}

function extractJsonObject(raw: string) {
  const cleaned = raw
    .replace(/^\uFEFF/, "")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error("No JSON object start found in AI response");

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i += 1) {
    const char = cleaned[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return cleaned.slice(start, i + 1);
    }
  }

  throw new Error("No complete JSON object found in AI response");
}

function parseNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeNumericFields(value: unknown) {
  if (!value || typeof value !== "object") return value;
  const report = value as { careers?: unknown };
  if (!Array.isArray(report.careers)) return value;

  return {
    ...(value as Record<string, unknown>),
    careers: report.careers.map((career, index) => {
      if (!career || typeof career !== "object") return career;
      const careerRecord = career as Record<string, unknown>;
      return {
        ...careerRecord,
        match: parseNumber(careerRecord.match, Math.max(70, 96 - index * 3)),
        demandScore: parseNumber(careerRecord.demandScore, Math.max(70, 94 - index * 3)),
      };
    }),
  };
}

function parseCareerReport(raw: string) {
  const jsonText = extractJsonObject(raw)
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/[\u0000-\u001F\u007F]/g, "");
  const parsed = JSON.parse(jsonText) as unknown;
  return ReportSchema.parse(normalizeNumericFields(parsed));
}

function ensureFiveCareers(report: CareerReport, data: z.infer<typeof AssessmentInput>) {
  const fallback = createFallbackReport(data);
  const careers = report.careers.slice(0, 5);

  for (const career of fallback.careers) {
    if (careers.length >= 5) break;
    if (!careers.some((existing) => existing.title.toLowerCase() === career.title.toLowerCase())) {
      careers.push(career);
    }
  }

  return ReportSchema.parse({
    ...report,
    strengths: report.strengths.length > 0 ? report.strengths : fallback.strengths,
    weaknesses: report.weaknesses.length > 0 ? report.weaknesses : fallback.weaknesses,
    careers,
  });
}

function createFallbackReport(data: z.infer<typeof AssessmentInput>): CareerReport {
  const country = data.country || "Uzbekistan";
  const interests = data.interests.length ? data.interests.join(", ") : "technology, problem solving, and growth";
  const subjects = data.subjects.length ? data.subjects.join(", ") : "mathematics and computer science";
  const preferred = data.preferredCountry || "international opportunities";

  return {
    summary: `Based on your interests in ${interests}, your subject preferences around ${subjects}, and your goal of pursuing ${preferred}, your profile is strongest for technology-driven careers that combine analytical thinking, continuous learning, and practical problem solving. The recommendations below prioritize high future demand, strong salary potential, and a realistic learning path from your current level.`,
    strengths: [
      "Strong potential for analytical and structured problem solving.",
      "Clear interest alignment with modern, high-growth career fields.",
      "Good foundation for building technical skills through consistent practice.",
      "Motivation to connect education choices with long-term salary and career outcomes.",
    ],
    weaknesses: [
      "Needs a focused portfolio to prove practical ability beyond theory.",
      "Should strengthen advanced English communication for international opportunities.",
      "May need deeper specialization before competing for premium roles.",
      "Should practice interview storytelling and project explanation skills.",
    ],
    careers: [
      {
        title: "AI Engineer",
        match: 98,
        whyItFits: "This path matches your interest in AI, programming, mathematics, and future-focused work. It rewards curiosity, problem solving, and the ability to build intelligent systems with real-world impact.",
        universityMajors: ["Computer Science", "Artificial Intelligence", "Data Science", "Software Engineering"],
        technicalSkills: ["Python", "Machine Learning", "Deep Learning", "Data Structures", "APIs", "Model Evaluation"],
        softSkills: ["Critical Thinking", "Communication", "Persistence", "Research Mindset", "Teamwork"],
        salary: {
          local: `${country}: UZS 180M-420M per year for strong junior-to-mid talent`,
          usa: "USD 120K-220K per year",
          europe: "EUR 70K-140K per year",
        },
        futureDemand: "Demand is expected to remain very high as companies adopt AI copilots, automation, personalization, and intelligent analytics across industries.",
        demandScore: 97,
        roadmap: [
          {
            phase: "Foundation",
            duration: "0-3 months",
            focus: "Build programming and math fundamentals.",
            milestones: ["Complete Python basics", "Practice algebra and statistics", "Build 3 small console projects"],
          },
          {
            phase: "Core AI Skills",
            duration: "3-8 months",
            focus: "Learn machine learning workflows and model evaluation.",
            milestones: ["Train models with scikit-learn", "Understand regression and classification", "Publish 2 notebook projects"],
          },
          {
            phase: "Production Portfolio",
            duration: "8-14 months",
            focus: "Turn AI knowledge into deployable products.",
            milestones: ["Build an AI web app", "Create a GitHub portfolio", "Deploy a model-backed API"],
          },
          {
            phase: "Professional Readiness",
            duration: "14-18 months",
            focus: "Prepare for internships, interviews, and real team workflows.",
            milestones: ["Practice ML interview questions", "Contribute to open source", "Apply for AI internships"],
          },
        ],
      },
      {
        title: "Data Scientist",
        match: 95,
        whyItFits: "Data science fits your analytical profile because it combines mathematics, pattern recognition, and communication. It is ideal if you enjoy finding meaning in information and turning it into decisions.",
        universityMajors: ["Data Science", "Statistics", "Computer Science", "Economics"],
        technicalSkills: ["Python", "SQL", "Statistics", "Data Visualization", "Machine Learning", "Experiment Design"],
        softSkills: ["Business Thinking", "Storytelling", "Attention to Detail", "Curiosity", "Collaboration"],
        salary: {
          local: `${country}: UZS 140M-340M per year`,
          usa: "USD 105K-180K per year",
          europe: "EUR 60K-120K per year",
        },
        futureDemand: "Organizations increasingly need people who can transform data into strategy, especially in finance, healthcare, education, logistics, and technology.",
        demandScore: 94,
        roadmap: [
          {
            phase: "Analytics Foundation",
            duration: "0-3 months",
            focus: "Learn data handling and statistical thinking.",
            milestones: ["Learn Python data libraries", "Practice SQL queries", "Complete statistics exercises"],
          },
          {
            phase: "Project Building",
            duration: "3-7 months",
            focus: "Create practical analysis projects.",
            milestones: ["Analyze public datasets", "Build dashboards", "Explain insights in written reports"],
          },
          {
            phase: "Machine Learning",
            duration: "7-12 months",
            focus: "Develop predictive modeling skills.",
            milestones: ["Train classification models", "Compare model metrics", "Document business recommendations"],
          },
        ],
      },
      {
        title: "Backend Developer",
        match: 92,
        whyItFits: "Backend development is a strong fit if you like logical systems, programming, databases, and building reliable products that users depend on every day.",
        universityMajors: ["Software Engineering", "Computer Science", "Information Systems"],
        technicalSkills: ["TypeScript", "Node.js", "Databases", "APIs", "Authentication", "Cloud Deployment"],
        softSkills: ["Reliability", "Debugging Patience", "Team Communication", "Ownership", "Systems Thinking"],
        salary: {
          local: `${country}: UZS 120M-300M per year`,
          usa: "USD 95K-170K per year",
          europe: "EUR 55K-110K per year",
        },
        futureDemand: "Backend engineers remain essential because every AI, mobile, SaaS, fintech, and enterprise product needs secure and scalable server-side systems.",
        demandScore: 91,
        roadmap: [
          {
            phase: "Programming Basics",
            duration: "0-3 months",
            focus: "Build strong coding fundamentals.",
            milestones: ["Learn TypeScript or Python", "Practice algorithms", "Build small API exercises"],
          },
          {
            phase: "Backend Systems",
            duration: "3-8 months",
            focus: "Learn databases, APIs, and authentication.",
            milestones: ["Build REST APIs", "Use PostgreSQL", "Implement login and permissions"],
          },
          {
            phase: "Deployment and Scale",
            duration: "8-12 months",
            focus: "Ship reliable production projects.",
            milestones: ["Deploy a full-stack app", "Add tests", "Monitor errors and performance"],
          },
        ],
      },
      {
        title: "Product Manager for AI Products",
        match: 88,
        whyItFits: "This career combines technology, communication, strategy, and leadership. It fits well if you enjoy understanding user needs and guiding teams to build useful AI-powered products.",
        universityMajors: ["Computer Science", "Business Administration", "Information Systems", "Innovation Management"],
        technicalSkills: ["AI Product Fundamentals", "Analytics", "Wireframing", "SQL Basics", "A/B Testing", "Prompt Design"],
        softSkills: ["Leadership", "Communication", "Prioritization", "Empathy", "Decision Making"],
        salary: {
          local: `${country}: UZS 130M-360M per year`,
          usa: "USD 115K-200K per year",
          europe: "EUR 70K-130K per year",
        },
        futureDemand: "Demand is growing for product leaders who understand both AI capabilities and real user problems, especially in SaaS, education, finance, and healthcare.",
        demandScore: 88,
        roadmap: [
          {
            phase: "Product Foundations",
            duration: "0-3 months",
            focus: "Learn product thinking and user research.",
            milestones: ["Study product case studies", "Interview potential users", "Write problem statements"],
          },
          {
            phase: "AI Product Skills",
            duration: "3-7 months",
            focus: "Understand how AI features are designed and evaluated.",
            milestones: ["Prototype AI workflows", "Define success metrics", "Create product requirement documents"],
          },
          {
            phase: "Portfolio and Leadership",
            duration: "7-12 months",
            focus: "Show that you can guide a product from idea to launch.",
            milestones: ["Launch a small product", "Collect user feedback", "Present a roadmap"],
          },
        ],
      },
      {
        title: "Cybersecurity Analyst",
        match: 85,
        whyItFits: "Cybersecurity fits a detail-oriented learner who likes technology, investigation, and protecting systems. It offers a clear skills ladder and strong global demand.",
        universityMajors: ["Cybersecurity", "Computer Science", "Information Security", "Network Engineering"],
        technicalSkills: ["Networking", "Linux", "Security Monitoring", "Python Scripting", "Cloud Security", "Incident Response"],
        softSkills: ["Attention to Detail", "Calm Under Pressure", "Ethical Judgment", "Communication", "Persistence"],
        salary: {
          local: `${country}: UZS 110M-280M per year`,
          usa: "USD 90K-165K per year",
          europe: "EUR 55K-115K per year",
        },
        futureDemand: "Demand is strong because businesses, governments, and AI-enabled platforms need better protection against fraud, data leaks, and infrastructure attacks.",
        demandScore: 86,
        roadmap: [
          {
            phase: "IT Basics",
            duration: "0-3 months",
            focus: "Understand computers, networks, and operating systems.",
            milestones: ["Learn networking fundamentals", "Practice Linux commands", "Understand web basics"],
          },
          {
            phase: "Security Foundations",
            duration: "3-8 months",
            focus: "Learn defensive security and risk analysis.",
            milestones: ["Study common vulnerabilities", "Use security labs", "Write incident reports"],
          },
          {
            phase: "Career Preparation",
            duration: "8-12 months",
            focus: "Build credibility with labs, certificates, and portfolio work.",
            milestones: ["Complete beginner certification prep", "Document lab projects", "Apply for SOC internships"],
          },
        ],
      },
    ],
  };
}

function buildResponse(report: CareerReport, data: z.infer<typeof AssessmentInput>, source: "ai" | "fallback") {
  return {
    report,
    generatedAt: new Date().toISOString(),
    user: { name: data.fullName, country: data.country },
    source,
  };
}

export const analyzeCareer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssessmentInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      console.error("[CareerAI analyzeCareer] Missing LOVABLE_API_KEY. Returning fallback report.");
      return buildResponse(createFallbackReport(data), data, "fallback");
    }

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    console.info("[CareerAI analyzeCareer] Starting report generation", {
      hasName: Boolean(data.fullName),
      country: data.country || "not provided",
      interestsCount: data.interests.length,
      subjectsCount: data.subjects.length,
      skillsCount: Object.keys(data.skills).length,
    });

    const attempts = [
      { label: "primary-schema-aligned", prompt: buildAnalysisPrompt(data, false) },
      { label: "simplified-json-only", prompt: buildAnalysisPrompt(data, true) },
    ];

    for (const attempt of attempts) {
      try {
        console.info(`[CareerAI analyzeCareer] Attempt: ${attempt.label}`, {
          promptLength: attempt.prompt.length,
          promptPreview: preview(attempt.prompt, 1200),
        });

        const result = await generateText({
          model: gateway("google/gemini-3-flash-preview"),
          prompt: attempt.prompt,
          temperature: 0.2,
          maxOutputTokens: 6500,
        });

        console.info(`[CareerAI analyzeCareer] Raw AI response received: ${attempt.label}`, {
          responseLength: result.text.length,
          finishReason: result.finishReason,
          responsePreview: preview(result.text),
        });

        const parsed = ensureFiveCareers(parseCareerReport(result.text), data);
        console.info(`[CareerAI analyzeCareer] Report parsed successfully: ${attempt.label}`, {
          careerCount: parsed.careers.length,
          topCareer: parsed.careers[0]?.title,
          matches: parsed.careers.map((career) => career.match),
        });

        return buildResponse(parsed, data, "ai");
      } catch (error) {
        console.error(`[CareerAI analyzeCareer] Attempt failed: ${attempt.label}`, {
          error: getErrorMessage(error),
        });
      }
    }

    console.error("[CareerAI analyzeCareer] All AI parsing attempts failed. Returning valid fallback report.");
    return buildResponse(createFallbackReport(data), data, "fallback");
  });
