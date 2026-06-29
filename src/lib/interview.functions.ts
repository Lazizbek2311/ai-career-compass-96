import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const Difficulty = z.enum(["beginner", "intermediate", "advanced"]);
const InterviewType = z.enum(["hr", "technical", "behavioral"]);

const GenerateInput = z.object({
  difficulty: Difficulty,
  type: InterviewType,
  role: z.string().optional().default(""),
  count: z.number().min(3).max(10).default(5),
});

const EvaluateInput = z.object({
  question: z.string(),
  answer: z.string(),
  difficulty: Difficulty,
  type: InterviewType,
  role: z.string().optional().default(""),
});

const FinalInput = z.object({
  role: z.string().optional().default(""),
  type: InterviewType,
  difficulty: Difficulty,
  items: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      score: z.number(),
    }),
  ),
});

export type InterviewDifficulty = z.infer<typeof Difficulty>;
export type InterviewType = z.infer<typeof InterviewType>;

const EvaluationSchema = z.object({
  score: z.number(),
  confidence: z.number(),
  feedback: z.string(),
  mistakes: z.array(z.string()),
  betterAnswer: z.string(),
});

export type Evaluation = z.infer<typeof EvaluationSchema>;

const FinalReportSchema = z.object({
  overallScore: z.number(),
  summary: z.string(),
  strongSkills: z.array(z.string()),
  weakSkills: z.array(z.string()),
  recommendedLearning: z.array(
    z.object({ topic: z.string(), why: z.string() }),
  ),
  nextSteps: z.array(z.string()),
});

export type FinalReport = z.infer<typeof FinalReportSchema>;

function extractJson(raw: string) {
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const startArr = cleaned.indexOf("[");
  const first = start === -1 ? startArr : startArr === -1 ? start : Math.min(start, startArr);
  if (first === -1) throw new Error("No JSON found");
  const open = cleaned[first];
  const close = open === "{" ? "}" : "]";
  let depth = 0, inStr = false, esc = false;
  for (let i = first; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return cleaned.slice(first, i + 1);
    }
  }
  throw new Error("Incomplete JSON");
}

function clamp(n: unknown, fallback: number) {
  const v = typeof n === "number" ? n : typeof n === "string" ? parseFloat(n.replace(/[^0-9.-]/g, "")) : NaN;
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

const labelFor = (t: z.infer<typeof InterviewType>) =>
  t === "hr" ? "HR / behavioral fit" : t === "technical" ? "Technical" : "Behavioral / situational";

async function callAi(prompt: string, maxTokens = 1500) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(key);
  const result = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    prompt,
    temperature: 0.3,
    maxOutputTokens: maxTokens,
  });
  return result.text;
}

export const generateQuestions = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => GenerateInput.parse(i))
  .handler(async ({ data }) => {
    const role = data.role?.trim() || "a relevant role";
    const prompt = `You are an expert ${labelFor(data.type)} interviewer.

Generate exactly ${data.count} ${data.difficulty} ${data.type} interview questions for ${role}.

Return ONLY a JSON array of strings. No markdown. Example: ["Q1?", "Q2?"]
Make the questions concise (1-2 sentences) and realistic.`;
    try {
      const raw = await callAi(prompt, 800);
      const parsed = JSON.parse(extractJson(raw));
      const arr = z.array(z.string()).parse(parsed).slice(0, data.count);
      if (arr.length === 0) throw new Error("Empty");
      return { questions: arr, source: "ai" as const };
    } catch (e) {
      console.error("[InterviewCoach] generateQuestions fallback", e);
      return { questions: fallbackQuestions(data.type, data.difficulty, role, data.count), source: "fallback" as const };
    }
  });

export const evaluateAnswer = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => EvaluateInput.parse(i))
  .handler(async ({ data }) => {
    const role = data.role?.trim() || "the candidate's target role";
    const prompt = `You are a senior interviewer evaluating an answer for ${role} (${data.difficulty} ${data.type}).

QUESTION: ${data.question}
ANSWER: ${data.answer || "(no answer given)"}

Return ONLY valid JSON with this exact structure:
{
  "score": 0-100 number,
  "confidence": 0-100 number (how confident the answer sounds),
  "feedback": "1-2 sentence professional feedback",
  "mistakes": ["short string", "short string"],
  "betterAnswer": "a concise improved model answer (3-6 sentences)"
}

Rules: scores are raw JSON numbers. Be honest. If the answer is empty or off-topic, score very low.`;
    try {
      const raw = await callAi(prompt, 1200);
      const obj = JSON.parse(extractJson(raw)) as Record<string, unknown>;
      return EvaluationSchema.parse({
        score: clamp(obj.score, 50),
        confidence: clamp(obj.confidence, 50),
        feedback: String(obj.feedback ?? ""),
        mistakes: Array.isArray(obj.mistakes) ? obj.mistakes.map(String) : [],
        betterAnswer: String(obj.betterAnswer ?? ""),
      });
    } catch (e) {
      console.error("[InterviewCoach] evaluate fallback", e);
      const empty = !data.answer.trim();
      return {
        score: empty ? 10 : 60,
        confidence: empty ? 10 : 55,
        feedback: empty
          ? "No answer was provided. Aim to share at least a brief structured response."
          : "Solid attempt. Add a concrete example, quantify the result, and connect it back to the role.",
        mistakes: empty ? ["No response submitted"] : ["Lacks concrete example", "Missing measurable impact"],
        betterAnswer:
          "Open with a one-sentence summary, walk through the situation, action, and measurable result using the STAR framework, then tie the outcome back to the role you are interviewing for.",
      } satisfies Evaluation;
    }
  });

export const finalizeInterview = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => FinalInput.parse(i))
  .handler(async ({ data }) => {
    const avg = Math.round(
      data.items.reduce((sum, it) => sum + (it.score || 0), 0) / Math.max(1, data.items.length),
    );
    const role = data.role?.trim() || "your target role";
    const prompt = `You are a senior interview coach. Produce a final report for a ${data.difficulty} ${data.type} mock interview for ${role}.

The candidate answered ${data.items.length} questions with an average score of ${avg}/100.
Question/answer/score list:
${data.items.map((it, i) => `${i + 1}. Q: ${it.question}\n   A: ${it.answer || "(no answer)"}\n   Score: ${it.score}`).join("\n")}

Return ONLY valid JSON:
{
  "overallScore": 0-100 number,
  "summary": "2-3 sentence honest summary",
  "strongSkills": ["string","string","string"],
  "weakSkills": ["string","string","string"],
  "recommendedLearning": [{"topic":"string","why":"string"}, ...],
  "nextSteps": ["string","string","string"]
}
3-5 items per list. Be specific and actionable.`;
    try {
      const raw = await callAi(prompt, 1400);
      const obj = JSON.parse(extractJson(raw)) as Record<string, unknown>;
      return FinalReportSchema.parse({
        overallScore: clamp(obj.overallScore, avg),
        summary: String(obj.summary ?? ""),
        strongSkills: Array.isArray(obj.strongSkills) ? obj.strongSkills.map(String) : [],
        weakSkills: Array.isArray(obj.weakSkills) ? obj.weakSkills.map(String) : [],
        recommendedLearning: Array.isArray(obj.recommendedLearning)
          ? (obj.recommendedLearning as Record<string, unknown>[]).map((r) => ({
              topic: String(r.topic ?? ""),
              why: String(r.why ?? ""),
            }))
          : [],
        nextSteps: Array.isArray(obj.nextSteps) ? obj.nextSteps.map(String) : [],
      });
    } catch (e) {
      console.error("[InterviewCoach] finalize fallback", e);
      return fallbackFinal(avg, data.type, role);
    }
  });

function fallbackQuestions(type: z.infer<typeof InterviewType>, diff: z.infer<typeof Difficulty>, role: string, count: number) {
  const banks: Record<string, string[]> = {
    hr: [
      "Tell me about yourself.",
      `Why are you interested in ${role}?`,
      "What are your biggest strengths and weaknesses?",
      "Where do you see yourself in five years?",
      "Why should we hire you?",
      "Describe a time you handled conflict at work or school.",
      "What is your expected compensation and why?",
    ],
    technical: [
      `Walk me through a recent project relevant to ${role}.`,
      "Explain a technical concept you find difficult, in simple terms.",
      "How would you debug a slow application?",
      "Describe the trade-offs you would weigh when choosing a database.",
      "How do you ensure code quality on a team?",
      "Design a small system to handle 1,000 concurrent users.",
      "Tell me about a bug that took you a long time to fix and what you learned.",
    ],
    behavioral: [
      "Tell me about a time you failed and what you did next.",
      "Describe a situation where you had to learn something quickly.",
      "Share a time you led a team or project to a measurable outcome.",
      "Tell me about a disagreement with a teammate and how you resolved it.",
      "Describe a goal you set for yourself and the steps you took to reach it.",
      "Tell me about a time you received tough feedback.",
      "Give an example of a time you took initiative.",
    ],
  };
  const base = banks[type];
  const extra = diff === "advanced" ? " Give a structured, in-depth answer with examples." : "";
  return base.slice(0, count).map((q) => q + extra);
}

function fallbackFinal(avg: number, _type: z.infer<typeof InterviewType>, role: string): FinalReport {
  return {
    overallScore: avg,
    summary: `You demonstrated reasonable interview readiness for ${role}. Focus on structuring answers with the STAR framework and quantifying results to lift your score significantly.`,
    strongSkills: ["Clear communication basics", "Willingness to reflect", "Domain awareness"],
    weakSkills: ["Quantified impact", "Concrete examples", "Concise structure"],
    recommendedLearning: [
      { topic: "STAR storytelling", why: "Adds structure to behavioral and HR answers." },
      { topic: "Mock technical drills", why: "Builds fluency under time pressure." },
      { topic: "Role-specific deep dives", why: `Strengthens credibility for ${role}.` },
    ],
    nextSteps: [
      "Re-run the interview at a higher difficulty in 3 days.",
      "Write 3 STAR stories you can adapt to most questions.",
      "Record yourself answering 5 questions and review for clarity.",
    ],
  };
}
