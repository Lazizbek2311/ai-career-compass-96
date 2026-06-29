import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const ResumeInput = z.object({
  fileName: z.string().default("resume"),
  kind: z.enum(["pdf", "text"]),
  // For pdf: base64 data. For text: extracted plain text.
  data: z.string().min(1),
  targetRole: z.string().optional().default(""),
});

const ScoreSchema = z.object({
  score: z.number(),
  summary: z.string(),
});

const ResumeReportSchema = z.object({
  atsScore: z.number(),
  overallSummary: z.string(),
  scores: z.object({
    grammar: ScoreSchema,
    readability: ScoreSchema,
    professionalism: ScoreSchema,
    experienceQuality: ScoreSchema,
    educationQuality: ScoreSchema,
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingSkills: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  improvements: z.array(
    z.object({
      area: z.string(),
      suggestion: z.string(),
    }),
  ),
  improvedResumeMarkdown: z.string(),
});

export type ResumeReport = z.infer<typeof ResumeReportSchema>;

const REQUIRED_STRUCTURE = `{
  "atsScore": 86,
  "overallSummary": "string",
  "scores": {
    "grammar": { "score": 90, "summary": "string" },
    "readability": { "score": 85, "summary": "string" },
    "professionalism": { "score": 88, "summary": "string" },
    "experienceQuality": { "score": 80, "summary": "string" },
    "educationQuality": { "score": 82, "summary": "string" }
  },
  "strengths": ["string","string","string","string"],
  "weaknesses": ["string","string","string"],
  "missingSkills": ["string","string","string"],
  "missingKeywords": ["string","string","string","string"],
  "improvements": [
    { "area": "string", "suggestion": "string" }
  ],
  "improvedResumeMarkdown": "string (a full rewritten resume in markdown)"
}`;

function buildPrompt(targetRole: string, resumeText?: string) {
  const role = targetRole?.trim() || "the candidate's apparent target role";
  return `You are CareerAI's expert resume reviewer and ATS specialist.

Analyze the provided resume and return ONLY a valid JSON object (no markdown fences, no commentary) with EXACTLY this structure and these keys:
${REQUIRED_STRUCTURE}

Rules:
- All score fields are raw JSON numbers from 0 to 100. No strings, no "/100".
- atsScore reflects ATS-readiness for ${role}.
- strengths: 4-6 concise bullet strings.
- weaknesses: 3-5 concise bullet strings.
- missingSkills: 3-7 technical/soft skills missing for ${role}.
- missingKeywords: 4-8 high-impact ATS keywords missing for ${role}.
- improvements: 4-8 objects, each with a short area name and a specific actionable suggestion.
- improvedResumeMarkdown: a FULL rewritten, ATS-optimized resume in clean markdown using sections (Summary, Skills, Experience, Education, Projects, Certifications). Use bullet points and quantified achievements where possible. Keep the candidate's real information; do not invent employers, but you may rephrase, restructure, and add reasonable measurable framing.
- Be concrete, premium, and professional. Do not use placeholders like "TBD".
${resumeText ? `\nRESUME TEXT:\n"""\n${resumeText}\n"""` : "\nThe resume is provided as an attached PDF file."}`;
}

function extractJsonObject(raw: string) {
  const cleaned = raw.replace(/^\uFEFF/, "").replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error("No JSON object found");
  let depth = 0,
    inString = false,
    escaped = false;
  for (let i = start; i < cleaned.length; i += 1) {
    const c = cleaned[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) return cleaned.slice(start, i + 1);
    }
  }
  throw new Error("Incomplete JSON");
}

function clampScore(value: unknown, fallback: number) {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value.replace(/[^0-9.-]/g, ""))
        : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalize(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const v = value as Record<string, unknown>;
  v.atsScore = clampScore(v.atsScore, 70);
  if (v.scores && typeof v.scores === "object") {
    const s = v.scores as Record<string, { score?: unknown; summary?: unknown }>;
    for (const key of Object.keys(s)) {
      if (s[key] && typeof s[key] === "object") {
        s[key] = { score: clampScore(s[key].score, 75), summary: String(s[key].summary ?? "") };
      }
    }
  }
  return v;
}

function parseReport(raw: string) {
  const json = extractJsonObject(raw).replace(/,\s*([}\]])/g, "$1");
  return ResumeReportSchema.parse(normalize(JSON.parse(json)));
}

function fallbackReport(targetRole: string): ResumeReport {
  const role = targetRole?.trim() || "your target role";
  return {
    atsScore: 72,
    overallSummary: `Your resume has solid fundamentals but needs ATS optimization and stronger quantified impact to compete for ${role}.`,
    scores: {
      grammar: { score: 85, summary: "Grammar is largely correct with minor polish opportunities." },
      readability: { score: 78, summary: "Readable structure; tighten phrasing and use consistent verb tense." },
      professionalism: { score: 82, summary: "Professional tone overall; sharpen the summary section." },
      experienceQuality: { score: 70, summary: "Experience is described but lacks quantifiable outcomes." },
      educationQuality: { score: 80, summary: "Education section is clear; add relevant coursework or honors." },
    },
    strengths: [
      "Clear chronological structure that ATS systems can parse.",
      "Relevant educational background aligned with the target role.",
      "Demonstrated commitment to continuous learning.",
      "Concise, professional tone throughout.",
    ],
    weaknesses: [
      "Bullet points describe duties instead of measurable impact.",
      "Missing high-value keywords specific to the target role.",
      "Summary section is generic and does not differentiate the candidate.",
    ],
    missingSkills: ["System Design", "Cloud Deployment", "Testing & QA", "Stakeholder Communication"],
    missingKeywords: ["TypeScript", "CI/CD", "Agile", "REST API", "Performance Optimization"],
    improvements: [
      { area: "Summary", suggestion: "Rewrite the summary as a 2-3 line value proposition with role title, years of experience, and 1-2 standout achievements." },
      { area: "Experience bullets", suggestion: "Convert each bullet to Action + Method + Quantified Result (e.g., 'Cut load time by 38% by introducing code-splitting')." },
      { area: "Keywords", suggestion: "Mirror keywords from the job description naturally throughout Skills and Experience sections." },
      { area: "Formatting", suggestion: "Use a single-column, ATS-friendly layout. Avoid tables, icons, and graphics." },
      { area: "Skills section", suggestion: "Group skills by category (Languages, Frameworks, Tools, Cloud) for fast scanning." },
    ],
    improvedResumeMarkdown: `# Your Name\n_${role} • email@example.com • +000-000-0000 • LinkedIn • GitHub_\n\n## Summary\nResults-driven candidate with experience delivering production software. Combines strong technical foundations with clear communication and measurable outcomes.\n\n## Skills\n**Languages:** TypeScript, Python\n**Frameworks:** React, Node.js\n**Tools:** Git, Docker, CI/CD\n**Cloud:** AWS basics\n\n## Experience\n**Role — Company** _(Year–Year)_\n- Delivered X feature that improved Y metric by Z%.\n- Collaborated with cross-functional teams of N people to ship monthly releases.\n- Reduced bug rate by N% by introducing automated tests.\n\n## Education\n**Degree — University** _(Year)_\n- Relevant coursework: ...\n\n## Projects\n**Project Name** — Short description with measurable outcome.\n\n## Certifications\n- Certification — Issuer (Year)\n`,
  };
}

const getErr = (e: unknown) => (e instanceof Error ? e.message : String(e));

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResumeInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      console.error("[ResumeOptimizer] Missing LOVABLE_API_KEY. Returning fallback.");
      return { report: fallbackReport(data.targetRole), source: "fallback" as const, generatedAt: new Date().toISOString() };
    }

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const isPdf = data.kind === "pdf";
    const promptText = buildPrompt(data.targetRole, isPdf ? undefined : data.data);

    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        temperature: 0.2,
        maxOutputTokens: 7000,
        messages: [
          {
            role: "user",
            content: isPdf
              ? [
                  { type: "text", text: promptText },
                  {
                    type: "file",
                    data: data.data, // base64 string accepted by AI SDK
                    mediaType: "application/pdf",
                  },
                ]
              : [{ type: "text", text: promptText }],
          },
        ],
      });

      console.info("[ResumeOptimizer] AI response received", {
        length: result.text.length,
        finishReason: result.finishReason,
      });

      const parsed = parseReport(result.text);
      return { report: parsed, source: "ai" as const, generatedAt: new Date().toISOString() };
    } catch (error) {
      console.error("[ResumeOptimizer] Analysis failed, returning fallback", { error: getErr(error) });
      return { report: fallbackReport(data.targetRole), source: "fallback" as const, generatedAt: new Date().toISOString() };
    }
  });
