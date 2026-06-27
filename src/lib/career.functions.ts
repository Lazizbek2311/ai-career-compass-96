import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
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
  strengths: z.array(z.string()).min(3).max(8),
  weaknesses: z.array(z.string()).min(2).max(6),
  careers: z
    .array(
      z.object({
        title: z.string(),
        match: z.number().min(0).max(100),
        whyItFits: z.string(),
        universityMajors: z.array(z.string()).min(2).max(6),
        technicalSkills: z.array(z.string()).min(3).max(10),
        softSkills: z.array(z.string()).min(3).max(8),
        salary: z.object({
          local: z.string(),
          usa: z.string(),
          europe: z.string(),
        }),
        futureDemand: z.string(),
        demandScore: z.number().min(0).max(100),
        roadmap: z
          .array(
            z.object({
              phase: z.string(),
              duration: z.string(),
              focus: z.string(),
              milestones: z.array(z.string()).min(2).max(5),
            }),
          )
          .min(3)
          .max(6),
      }),
    )
    .length(5),
});

export type CareerReport = z.infer<typeof ReportSchema>;

export const analyzeCareer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AssessmentInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are an expert AI career counselor. Analyze the following user assessment and produce a detailed, personalized career report.

USER ASSESSMENT (JSON):
${JSON.stringify(data, null, 2)}

Requirements:
- Recommend EXACTLY 5 distinct careers ranked by match (highest first), each between 70-99%.
- For each career: explain WHY it fits this specific user (reference their interests, personality, and skills).
- Provide local salary in ${data.country || "Uzbekistan"} (use local currency) plus USA and Europe (USD/EUR per year).
- Be concrete, specific, and motivational. Avoid generic advice.
- Roadmap: 3-5 phases from beginner to professional, with durations and concrete milestones.
- Strengths/weaknesses are about the user, not generic.
- Write in clear, professional English.`;

    const result = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({ schema: ReportSchema }),
      prompt,
    });

    return {
      report: result.output as CareerReport,
      generatedAt: new Date().toISOString(),
      user: { name: data.fullName, country: data.country },
    };
  });
