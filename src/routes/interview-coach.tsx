import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  Sparkles,
  Loader2,
  Timer,
  Mic,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  GraduationCap,
  Brain,
  Target,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import {
  generateQuestions,
  evaluateAnswer,
  finalizeInterview,
  type Evaluation,
  type FinalReport,
} from "@/lib/interview.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/interview-coach")({
  head: () => ({
    meta: [
      { title: "Interview Coach — CareerAI" },
      {
        name: "description",
        content:
          "AI-powered mock interviews with instant scoring, confidence meter, mistakes, model answers, and a final report.",
      },
    ],
  }),
  component: InterviewCoachPage,
});

type Difficulty = "beginner" | "intermediate" | "advanced";
type Type = "hr" | "technical" | "behavioral";
type Stage = "setup" | "interview" | "report";

type Round = {
  question: string;
  answer: string;
  evaluation: Evaluation | null;
};

const DIFFICULTIES: { id: Difficulty; gradient: string }[] = [
  { id: "beginner", gradient: "from-emerald-500/20 to-teal-500/20" },
  { id: "intermediate", gradient: "from-blue-500/20 to-indigo-500/20" },
  { id: "advanced", gradient: "from-fuchsia-500/20 to-rose-500/20" },
];

const TYPES: { id: Type; icon: typeof Brain }[] = [
  { id: "hr", icon: MessageCircle },
  { id: "technical", icon: Brain },
  { id: "behavioral", icon: GraduationCap },
];

const TIME_LIMITS: Record<Difficulty, number> = { beginner: 120, intermediate: 90, advanced: 60 };

function InterviewCoachPage() {
  const { t } = useI18n();
  const generate = useServerFn(generateQuestions);
  const evaluate = useServerFn(evaluateAnswer);
  const finalize = useServerFn(finalizeInterview);

  const [stage, setStage] = useState<Stage>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [type, setType] = useState<Type>("behavioral");
  const [role, setRole] = useState("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
  const [finalizing, setFinalizing] = useState(false);

  const timeLimit = TIME_LIMITS[difficulty];
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => () => clearTimer(), []);

  function startTimer() {
    clearTimer();
    setTimeLeft(timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearTimer(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleStart() {
    try {
      setLoading(true);
      const res = await generate({ data: { difficulty, type, role, count: 5 } });
      setRounds(res.questions.map((q) => ({ question: q, answer: "", evaluation: null })));
      setCurrentIdx(0);
      setAnswer("");
      setStage("interview");
      startTimer();
      if (res.source === "fallback") toast.warning(t("interview.toastFallback"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("interview.toastStartFail"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    const current = rounds[currentIdx];
    if (!current) return;
    try {
      setSubmitting(true);
      clearTimer();
      const evalRes = await evaluate({
        data: { question: current.question, answer, difficulty, type, role },
      });
      setRounds((prev) => {
        const next = [...prev];
        next[currentIdx] = { ...next[currentIdx], answer, evaluation: evalRes };
        return next;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("interview.toastEvalFail"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (currentIdx + 1 >= rounds.length) { void doFinalize(); return; }
    setCurrentIdx((i) => i + 1);
    setAnswer("");
    startTimer();
  }

  async function doFinalize() {
    try {
      setFinalizing(true);
      clearTimer();
      const items = rounds.map((r) => ({
        question: r.question,
        answer: r.answer,
        score: r.evaluation?.score ?? 0,
      }));
      const res = await finalize({ data: { difficulty, type, role, items } });
      setFinalReport(res);
      setStage("report");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("interview.toastReportFail"));
    } finally {
      setFinalizing(false);
    }
  }

  function resetAll() {
    clearTimer();
    setStage("setup");
    setRounds([]);
    setCurrentIdx(0);
    setAnswer("");
    setFinalReport(null);
  }

  const diffKeys: Record<Difficulty, [string, string]> = {
    beginner: ["interview.difficultyBeginner", "interview.difficultyBeginnerDesc"],
    intermediate: ["interview.difficultyIntermediate", "interview.difficultyIntermediateDesc"],
    advanced: ["interview.difficultyAdvanced", "interview.difficultyAdvancedDesc"],
  };
  const typeKeys: Record<Type, [string, string]> = {
    hr: ["interview.typeHR", "interview.typeHRDesc"],
    technical: ["interview.typeTechnical", "interview.typeTechnicalDesc"],
    behavioral: ["interview.typeBehavioral", "interview.typeBehavioralDesc"],
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass p-6 sm:p-8 shadow-elegant"
        >
          <div className="absolute inset-0 gradient-hero opacity-60 pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> {t("interview.badge")}
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                {t("interview.heading")} <span className="gradient-text">{t("interview.headingHighlight")}</span>
              </h1>
              <p className="mt-2 text-muted-foreground max-w-xl">{t("interview.subheading")}</p>
            </div>
            <div className="grid h-20 w-20 place-items-center rounded-3xl gradient-brand shadow-glow shrink-0">
              <Mic className="h-9 w-9 text-white" />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <SectionCard title={t("interview.section1")}>
                <div className="grid sm:grid-cols-3 gap-3">
                  {TYPES.map((typeItem) => (
                    <PickCard
                      key={typeItem.id}
                      active={type === typeItem.id}
                      onClick={() => setType(typeItem.id)}
                      label={t(typeKeys[typeItem.id][0])}
                      desc={t(typeKeys[typeItem.id][1])}
                      Icon={typeItem.icon}
                    />
                  ))}
                </div>
              </SectionCard>

              <SectionCard title={t("interview.section2")}>
                <div className="grid sm:grid-cols-3 gap-3">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      className={`text-left rounded-2xl p-4 bg-gradient-to-br ${d.gradient} border transition-all ${
                        difficulty === d.id
                          ? "border-primary/60 shadow-elegant scale-[1.01]"
                          : "border-border/60 hover:border-primary/40"
                      }`}
                    >
                      <div className="text-sm font-semibold">{t(diffKeys[d.id][0])}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t(diffKeys[d.id][1])}</div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        {t("interview.timePerQuestion")} {TIME_LIMITS[d.id]}{t("interview.timeUnit")}
                      </div>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title={t("interview.section3")}>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={t("interview.rolePlaceholder")}
                  className="rounded-full bg-secondary/60 border-border/60"
                />
                <div className="mt-5 flex justify-end">
                  <Button
                    onClick={handleStart}
                    disabled={loading}
                    className="h-11 rounded-full gradient-brand text-white border-0 hover:opacity-90 px-6"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("interview.preparing")}</>
                    ) : (
                      <>{t("interview.startBtn")} <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {stage === "interview" && (
            <motion.div key="interview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <InterviewStage
                rounds={rounds}
                currentIdx={currentIdx}
                answer={answer}
                setAnswer={setAnswer}
                timeLeft={timeLeft}
                timeLimit={timeLimit}
                onSubmit={handleSubmit}
                onNext={handleNext}
                submitting={submitting}
                finalizing={finalizing}
                onCancel={resetAll}
              />
            </motion.div>
          )}

          {stage === "report" && finalReport && (
            <motion.div key="report" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ReportView report={finalReport} onReset={resetAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl glass p-6 shadow-elegant">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function PickCard({ active, onClick, label, desc, Icon }: { active: boolean; onClick: () => void; label: string; desc: string; Icon: typeof Brain }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl p-4 border transition-all ${
        active ? "border-primary/60 bg-accent/60 shadow-elegant scale-[1.01]" : "border-border/60 bg-accent/20 hover:bg-accent/40"
      }`}
    >
      <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-sm font-semibold">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </button>
  );
}

function InterviewStage({
  rounds, currentIdx, answer, setAnswer, timeLeft, timeLimit,
  onSubmit, onNext, submitting, finalizing, onCancel,
}: {
  rounds: Round[]; currentIdx: number; answer: string; setAnswer: (v: string) => void;
  timeLeft: number; timeLimit: number; onSubmit: () => void; onNext: () => void;
  submitting: boolean; finalizing: boolean; onCancel: () => void;
}) {
  const { t } = useI18n();
  const current = rounds[currentIdx];
  const progress = useMemo(
    () => ((currentIdx + (current?.evaluation ? 1 : 0)) / rounds.length) * 100,
    [currentIdx, current, rounds.length],
  );
  const isLast = currentIdx + 1 >= rounds.length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl glass p-6 shadow-elegant">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("interview.question")} {currentIdx + 1} {t("interview.of")} {rounds.length}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Timer className="h-4 w-4" />
            <span className={timeLeft < 15 ? "text-destructive" : ""}>
              {String(Math.floor(timeLeft / 60)).padStart(1, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
        <Progress value={progress} className="mt-3 h-1.5" />
        <h3 className="mt-5 text-xl sm:text-2xl font-semibold leading-snug">{current?.question}</h3>

        {!current?.evaluation ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("interview.answerPlaceholder")}
              rows={7}
              className="mt-4 w-full rounded-2xl bg-secondary/60 border border-border/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("interview.timePerAnswerPrefix")} {timeLimit}{t("interview.timeUnit")} {t("interview.timePerAnswerSuffix")}</span>
              <span>{answer.trim().split(/\s+/).filter(Boolean).length} {t("interview.words")}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 justify-end">
              <Button variant="ghost" className="rounded-full" onClick={onCancel}>
                {t("interview.cancel")}
              </Button>
              <Button onClick={onSubmit} disabled={submitting} className="h-11 rounded-full gradient-brand text-white border-0 hover:opacity-90 px-6">
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("interview.evaluating")}</>
                ) : (
                  <>{t("interview.submitAnswer")}</>
                )}
              </Button>
            </div>
          </>
        ) : (
          <EvaluationView evaluation={current.evaluation} answer={current.answer} isLast={isLast} finalizing={finalizing} onNext={onNext} />
        )}
      </div>
    </div>
  );
}

function EvaluationView({ evaluation, answer, isLast, finalizing, onNext }: {
  evaluation: Evaluation; answer: string; isLast: boolean; finalizing: boolean; onNext: () => void;
}) {
  const { t } = useI18n();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <ScoreTile label={t("interview.scoreLabel")} value={evaluation.score} icon={Gauge} />
        <ScoreTile label={t("interview.confidenceLabel")} value={evaluation.confidence} icon={Target} />
        <div className="rounded-2xl p-4 bg-accent/30 border border-border/60">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("interview.feedbackLabel")}</div>
          <p className="mt-1 text-sm">{evaluation.feedback}</p>
        </div>
      </div>

      {answer && (
        <div className="rounded-2xl p-4 bg-secondary/40 border border-border/60">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("interview.yourAnswer")}</div>
          <p className="mt-1 text-sm whitespace-pre-wrap">{answer}</p>
        </div>
      )}

      {evaluation.mistakes.length > 0 && (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/15 to-rose-500/15 border border-border/60">
          <div className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> {t("interview.mistakesToFix")}
          </div>
          <ul className="mt-2 space-y-1.5">
            {evaluation.mistakes.map((m, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-border/60">
        <div className="font-semibold text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-emerald-500" /> {t("interview.betterAnswer")}
        </div>
        <p className="mt-2 text-sm whitespace-pre-wrap">{evaluation.betterAnswer}</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={finalizing} className="h-11 rounded-full gradient-brand text-white border-0 hover:opacity-90 px-6">
          {finalizing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("interview.generatingReport")}</>
          ) : isLast ? (
            <>{t("interview.finishReport")} <Trophy className="ml-2 h-4 w-4" /></>
          ) : (
            <>{t("interview.nextQuestion")} <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

function ScoreTile({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Gauge }) {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-border/60">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <Progress value={value} className="mt-2 h-1.5" />
    </div>
  );
}

function ReportView({ report, onReset }: { report: FinalReport; onReset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl glass p-6 sm:p-8 shadow-elegant flex flex-col sm:flex-row sm:items-center gap-6">
        <Ring value={report.overallScore} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("interview.finalReportLabel")}</div>
          <h2 className="mt-1 text-2xl font-bold">{t("interview.overallPerformance")}</h2>
          <p className="mt-2 text-muted-foreground">{report.summary}</p>
          <div className="mt-4">
            <Button onClick={onReset} variant="outline" className="rounded-full">
              <RotateCcw className="mr-2 h-4 w-4" /> {t("interview.tryAnother")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ListCard title={t("interview.strongSkills")} items={report.strongSkills} icon={CheckCircle2} tone="text-emerald-500" ring="from-emerald-500/15 to-teal-500/15" />
        <ListCard title={t("interview.weakSkills")} items={report.weakSkills} icon={AlertTriangle} tone="text-amber-500" ring="from-amber-500/15 to-rose-500/15" />
      </div>

      <div className="rounded-3xl glass p-6 shadow-elegant">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="h-4 w-4" /> {t("interview.recommendedLearning")}
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {report.recommendedLearning.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-accent/30 p-4 hover:bg-accent/50 transition">
              <div className="text-sm font-semibold">{r.topic}</div>
              <p className="mt-1 text-xs text-muted-foreground">{r.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl glass p-6 shadow-elegant">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="h-4 w-4" /> {t("interview.nextSteps")}
        </h3>
        <ul className="space-y-2">
          {report.nextSteps.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ListCard({ title, items, icon: Icon, tone, ring }: { title: string; items: string[]; icon: typeof CheckCircle2; tone: string; ring: string }) {
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

function Ring({ value }: { value: number }) {
  const { t } = useI18n();
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="currentColor" strokeWidth="10" className="text-border/60" fill="none" />
        <motion.circle
          cx="70" cy="70" r={r} strokeWidth="10" fill="none" strokeLinecap="round" stroke="url(#ig)"
          initial={{ strokeDasharray: c, strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.2 270)" />
            <stop offset="100%" stopColor="oklch(0.75 0.16 200)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("interview.ringScore")}</div>
        </div>
      </div>
    </div>
  );
}
