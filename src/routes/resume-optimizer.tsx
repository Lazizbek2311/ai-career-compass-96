import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Wand2,
  Target,
  Gauge,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  Layout as LayoutIcon,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { analyzeResume, type ResumeReport } from "@/lib/resume.functions";
import { l } from "@/lib/i18n";

export const Route = createFileRoute("/resume-optimizer")({
  head: () => ({
    meta: [
      { title: "Resume Optimizer — CareerAI" },
      {
        name: "description",
        content:
          "AI-powered resume & CV optimizer. Get ATS score, grammar, readability, missing keywords, and a rewritten resume.",
      },
    ],
  }),
  component: ResumeOptimizerPage,
});

function ResumeOptimizerPage() {
  const { t } = l();
  const analyze = useServerFn(analyzeResume);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ResumeReport | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const TEMPLATES = [
    {
      name: t("resumeOpt.templateModern"),
      desc: t("resumeOpt.templateModernDesc"),
      gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    },
    {
      name: t("resumeOpt.templateExecutive"),
      desc: t("resumeOpt.templateExecutiveDesc"),
      gradient: "from-amber-500/20 via-orange-500/20 to-rose-500/20",
    },
    {
      name: t("resumeOpt.templateCreative"),
      desc: t("resumeOpt.templateCreativeDesc"),
      gradient: "from-fuchsia-500/20 via-pink-500/20 to-rose-500/20",
    },
    {
      name: t("resumeOpt.templateAts"),
      desc: t("resumeOpt.templateAtsDesc"),
      gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    },
  ];

  async function readFileAsBase64(f: File): Promise<string> {
    const buf = await f.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  async function extractDocxText(f: File): Promise<string> {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await f.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  async function handleAnalyze() {
    try {
      setLoading(true);
      setReport(null);

      let payload: { kind: "pdf" | "text"; data: string; fileName: string };

      if (file) {
        const name = file.name.toLowerCase();
        if (name.endsWith(".pdf")) {
          payload = { kind: "pdf", data: await readFileAsBase64(file), fileName: file.name };
        } else if (name.endsWith(".docx")) {
          const text = await extractDocxText(file);
          if (!text.trim()) throw new Error(t("resumeOpt.toastDocxFail"));
          payload = { kind: "text", data: text, fileName: file.name };
        } else if (name.endsWith(".txt")) {
          payload = { kind: "text", data: await file.text(), fileName: file.name };
        } else {
          toast.error(t("resumeOpt.toastBadFile"));
          setLoading(false);
          return;
        }
      } else if (pastedText.trim().length > 50) {
        payload = { kind: "text", data: pastedText, fileName: "pasted-resume.txt" };
      } else {
        toast.error(t("resumeOpt.toastNoContent"));
        setLoading(false);
        return;
      }

      const result = await analyze({ data: { ...payload, targetRole } });
      setReport(result.report);
      if (result.source === "fallback") {
        toast.warning(t("resumeOpt.toastFallback"));
      } else {
        toast.success(t("resumeOpt.toastSuccess"));
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : t("resumeOpt.toastAnalysisFail"));
    } finally {
      setLoading(false);
    }
  }

  function downloadImproved() {
    if (!report) return;
    const blob = new Blob([report.improvedResumeMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "improved-resume.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass p-6 sm:p-8 shadow-elegant"
        >
          <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> {t("resumeOpt.badge")}
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                {t("resumeOpt.heading")} <span className="gradient-text">{t("resumeOpt.headingHighlight")}</span>
              </h1>
              <p className="mt-2 text-muted-foreground max-w-xl">
                {t("resumeOpt.subheading")}
              </p>
            </div>
            <div className="grid h-20 w-20 place-items-center rounded-3xl gradient-brand shadow-glow shrink-0">
              <Wand2 className="h-9 w-9 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Upload */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-3xl glass p-6 shadow-elegant"
          >
            <h2 className="text-lg font-semibold mb-4">{t("resumeOpt.uploadSection")}</h2>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-border/80 hover:border-primary/60 hover:bg-accent/40 transition-all p-8 text-center group"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-brand shadow-glow mb-3 group-hover:scale-105 transition-transform">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <p className="font-semibold">
                {file ? file.name : t("resumeOpt.uploadPrompt")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("resumeOpt.uploadHint")}
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </button>

            <div className="mt-5">
              <label className="text-sm font-medium">{t("resumeOpt.pasteLabel")}</label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={t("resumeOpt.pastePlaceholder")}
                rows={5}
                className="mt-2 w-full rounded-2xl bg-secondary/60 border border-border/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-3">
              <div>
                <label className="text-sm font-medium">{t("resumeOpt.targetRoleLabel")}</label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder={t("resumeOpt.targetRolePlaceholder")}
                  className="mt-2 rounded-full bg-secondary/60 border-border/60"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="sm:self-end h-11 rounded-full gradient-brand text-white border-0 hover:opacity-90 px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("resumeOpt.analyzing")}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> {t("resumeOpt.analyzeBtn")}
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Templates */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl glass p-6 shadow-elegant"
          >
            <div className="flex items-center gap-2 mb-4">
              <LayoutIcon className="h-4 w-4" />
              <h2 className="text-lg font-semibold">{t("resumeOpt.templatesTitle")}</h2>
            </div>
            <div className="space-y-3">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.name}
                  className={`group relative rounded-2xl p-4 bg-gradient-to-br ${tpl.gradient} border border-border/60 hover:shadow-elegant transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{tpl.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tpl.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 group-hover:opacity-100 transition" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {report && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* ATS hero */}
              <div className="rounded-3xl glass p-6 sm:p-8 shadow-elegant flex flex-col sm:flex-row sm:items-center gap-6">
                <ATSCircle value={report.atsScore} atsLabel={t("resumeOpt.atsLabel")} />
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("resumeOpt.overallAnalysis")}
                  </div>
                  <h2 className="mt-1 text-2xl font-bold">{t("resumeOpt.atsScore")}</h2>
                  <p className="mt-2 text-muted-foreground">{report.overallSummary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={downloadImproved} className="rounded-full gradient-brand text-white border-0 hover:opacity-90">
                      <Download className="mr-2 h-4 w-4" /> {t("resumeOpt.downloadImproved")}
                    </Button>
                    <Button variant="outline" className="rounded-full" onClick={() => {
                      navigator.clipboard.writeText(report.improvedResumeMarkdown);
                      toast.success(t("resumeOpt.toastCopied"));
                    }}>
                      {t("resumeOpt.copyMarkdown")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Score cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <ScoreCard icon={BookOpen} label={t("resumeOpt.grammarLabel")} score={report.scores.grammar.score} summary={report.scores.grammar.summary} tone="from-blue-500/20 to-indigo-500/20" />
                <ScoreCard icon={Gauge} label={t("resumeOpt.readabilityLabel")} score={report.scores.readability.score} summary={report.scores.readability.summary} tone="from-emerald-500/20 to-teal-500/20" />
                <ScoreCard icon={Award} label={t("resumeOpt.professionalismLabel")} score={report.scores.professionalism.score} summary={report.scores.professionalism.summary} tone="from-amber-500/20 to-orange-500/20" />
                <ScoreCard icon={Briefcase} label={t("resumeOpt.experienceLabel")} score={report.scores.experienceQuality.score} summary={report.scores.experienceQuality.summary} tone="from-fuchsia-500/20 to-pink-500/20" />
                <ScoreCard icon={GraduationCap} label={t("resumeOpt.educationLabel")} score={report.scores.educationQuality.score} summary={report.scores.educationQuality.summary} tone="from-cyan-500/20 to-sky-500/20" />
              </div>

              {/* Strengths / Weaknesses */}
              <div className="grid lg:grid-cols-2 gap-6">
                <ListCard
                  title={t("resumeOpt.strengthsTitle")}
                  items={report.strengths}
                  icon={CheckCircle2}
                  tone="text-emerald-500"
                  ring="from-emerald-500/15 to-teal-500/15"
                />
                <ListCard
                  title={t("resumeOpt.weaknessesTitle")}
                  items={report.weaknesses}
                  icon={AlertTriangle}
                  tone="text-amber-500"
                  ring="from-amber-500/15 to-rose-500/15"
                />
              </div>

              {/* Missing skills/keywords */}
              <div className="grid lg:grid-cols-2 gap-6">
                <ChipCard title={t("resumeOpt.missingSkillsTitle")} items={report.missingSkills} icon={Target} />
                <ChipCard title={t("resumeOpt.missingKeywordsTitle")} items={report.missingKeywords} icon={Sparkles} />
              </div>

              {/* Improvements */}
              <div className="rounded-3xl glass p-6 shadow-elegant">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wand2 className="h-4 w-4" /> {t("resumeOpt.suggestedImprovements")}
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {report.improvements.map((imp, i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-accent/30 p-4 hover:bg-accent/50 transition">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {imp.area}
                      </div>
                      <p className="mt-1 text-sm">{imp.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improved resume */}
              <div className="rounded-3xl glass p-6 shadow-elegant">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" /> {t("resumeOpt.improvedPreview")}
                  </h3>
                  <Button size="sm" onClick={downloadImproved} className="rounded-full gradient-brand text-white border-0 hover:opacity-90">
                    <Download className="mr-2 h-3.5 w-3.5" /> {t("resumeOpt.downloadMd")}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-secondary/50 rounded-2xl p-5 border border-border/60 max-h-[600px] overflow-auto font-sans">
                  {report.improvedResumeMarkdown}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function ATSCircle({ value, atsLabel }: { value: number; atsLabel: string }) {
  const radius = 54;
  const c = 2 * Math.PI * radius;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} stroke="currentColor" strokeWidth="10" className="text-border/60" fill="none" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          stroke="url(#atsg)"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="atsg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.2 270)" />
            <stop offset="100%" stopColor="oklch(0.75 0.16 200)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{atsLabel}</div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  score,
  summary,
  tone,
}: {
  icon: typeof Gauge;
  label: string;
  score: number;
  summary: string;
  tone: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 glass shadow-elegant bg-gradient-to-br ${tone} border border-border/60`}
    >
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-background/60">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
      <div className="mt-3 text-sm font-semibold">{label}</div>
      <Progress value={score} className="mt-2 h-1.5" />
      <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{summary}</p>
    </motion.div>
  );
}

function ListCard({
  title,
  items,
  icon: Icon,
  tone,
  ring,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  tone: string;
  ring: string;
}) {
  return (
    <div className={`rounded-3xl glass p-6 shadow-elegant bg-gradient-to-br ${ring} border border-border/60`}>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${tone}`} /> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-current ${tone}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChipCard({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof Target }) {
  return (
    <div className="rounded-3xl glass p-6 shadow-elegant">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" /> {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span
            key={i}
            className="rounded-full px-3 py-1 text-xs font-medium bg-secondary/70 border border-border/60"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
