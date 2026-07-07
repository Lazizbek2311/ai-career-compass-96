import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Brain,
  Sparkles,
  Trophy,
  TrendingUp,
  BookOpen,
  Zap,
  Award,
  Flame,
  Target,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Lightbulb,
  Quote,
  Plus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/lib/user";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CareerAI" },
      { name: "description", content: "Your personal AI career dashboard." },
    ],
  }),
  component: DashboardPage,
});

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`glass rounded-2xl shadow-elegant ${className}`}
    >
      {children}
    </motion.div>
  );
}

function DashboardPage() {
  const { t } = useI18n();
  const { firstName } = useUser();


  const stats = [
    { key: "careerMatch", value: "98%", icon: Target, color: "from-violet-500 to-fuchsia-500" },
    { key: "lessonsDone", value: "127", icon: BookOpen, color: "from-sky-500 to-cyan-500" },
    { key: "skillsLearned", value: "34", icon: Brain, color: "from-emerald-500 to-teal-500" },
    { key: "aiSessions", value: "412", icon: Sparkles, color: "from-amber-500 to-orange-500" },
    { key: "certificates", value: "9", icon: Award, color: "from-rose-500 to-pink-500" },
    { key: "dailyStreak", value: "28d", icon: Flame, color: "from-orange-500 to-red-500" },
  ];

  const careers = [
    { key: "aiEngineer", match: 98, salary: "$140k", trend: "+12%" },
    { key: "dataScientist", match: 95, salary: "$125k", trend: "+9%" },
    { key: "backendDeveloper", match: 92, salary: "$118k", trend: "+7%" },
  ];

  const skills = [
    { key: "python", value: 86 },
    { key: "mathematics", value: 72 },
    { key: "english", value: 91 },
    { key: "problemSolving", value: 78 },
  ];

  const salaries = [
    { key: "uzbekistan", flag: "🇺🇿", value: "$24,000" },
    { key: "unitedStates", flag: "🇺🇸", value: "$140,000" },
    { key: "germany", flag: "🇩🇪", value: "€85,000" },
  ];

  const tasks = [
    { key: "python", done: false, due: t("modules.dashboard.tasks.today") },
    { key: "personality", done: false, due: t("modules.dashboard.tasks.tomorrow") },
    { key: "cv", done: true, due: t("modules.dashboard.tasks.done") },
    { key: "mock", done: false, due: t("modules.dashboard.tasks.fri") },
  ];

  const achievements = [
    { key: "fastLearner", icon: Zap, color: "from-amber-400 to-orange-500" },
    { key: "aiPioneer", icon: Brain, color: "from-violet-500 to-fuchsia-500" },
    { key: "streakMaster", icon: Flame, color: "from-orange-500 to-red-500" },
    { key: "top1", icon: Trophy, color: "from-yellow-400 to-amber-500" },
    { key: "mentor", icon: Sparkles, color: "from-sky-400 to-cyan-500" },
    { key: "certified", icon: Award, color: "from-emerald-400 to-teal-500" },
  ];

  const quickActions = [
    { key: "startTest", icon: Brain, to: "/career-test" as const },
    { key: "continueLearning", icon: PlayCircle, to: "/learning-roadmap" as const },
    { key: "askAi", icon: Sparkles, to: "/ai-mentor" as const },
    { key: "buildCv", icon: FileText, to: "/cv-builder" as const },
  ];

  const tips: Array<"t1" | "t2" | "t3"> = ["t1", "t2", "t3"];

  const [progressValues, setProgressValues] = useState(skills.map(() => 0));
  useEffect(() => {
    const id = setTimeout(() => setProgressValues(skills.map((s) => s.value)), 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          <Card className="p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute inset-0 gradient-brand opacity-[0.08] pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("modules.dashboard.welcomeBack")}</p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {firstName} <span className="inline-block">👋</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {t("modules.dashboard.currentGoal")}:{" "}
                  <span className="text-foreground font-medium">{t("modules.dashboard.becomeAiEngineer")}</span>
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="text-muted-foreground">{t("modules.dashboard.progress")}</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-background/60 border border-border/60 p-3 max-w-lg">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{t("modules.dashboard.aiTip")}</span>{" "}
                    {t("modules.dashboard.aiTipText")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <Link to="/learning-roadmap">
                  <Button className="rounded-full gradient-brand text-white border-0 hover:opacity-90 shadow-elegant">
                    {t("modules.dashboard.continueLearning")}
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/learning-roadmap">
                  <Button variant="outline" className="rounded-full">
                    {t("modules.dashboard.viewRoadmap")}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <Card key={s.key} delay={0.05 * i} className="p-4 hover:shadow-glow transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{t(`modules.dashboard.stats.${s.key}`)}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${s.color} shadow-elegant`}>
                    <s.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">{t("modules.dashboard.topMatches")}</h2>
                  <p className="text-xs text-muted-foreground">{t("modules.dashboard.aiPowered")}</p>
                </div>
                <Badge variant="secondary" className="rounded-full">{t("modules.dashboard.updatedToday")}</Badge>
              </div>
              <div className="space-y-3">
                {careers.map((c, i) => (
                  <motion.div
                    key={c.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-white text-sm font-bold shrink-0">
                        {c.match}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{t(`careers.${c.key}`)}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("modules.dashboard.avg")} {c.salary} ·{" "}
                          <span className="text-emerald-500 font-medium">{c.trend}</span>
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">{t("modules.dashboard.learningProgress")}</h2>
                  <p className="text-xs text-muted-foreground">{t("modules.dashboard.thisSemester")}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="space-y-4">
                {skills.map((s, i) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="font-medium">{t(`subjects.${s.key}`)}</span>
                      <span className="text-muted-foreground">{s.value}%</span>
                    </div>
                    <Progress value={progressValues[i]} className="h-2 transition-all duration-1000" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold">{t("modules.dashboard.salaryPreview")}</h2>
                <p className="text-xs text-muted-foreground">{t("modules.dashboard.estimatedFor")}</p>
              </div>
              <Link to="/salary-analytics">
                <Button variant="ghost" size="sm" className="rounded-full">
                  {t("modules.dashboard.explore")} <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {salaries.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-xl border border-border/60 p-4 bg-background/40 hover:shadow-elegant transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{s.flag}</span>
                    <span className="text-sm font-medium">{t(`countries.${s.key}`)}</span>
                  </div>
                  <p className="text-2xl font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("modules.dashboard.perYear")}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">{t("modules.dashboard.upcomingTasks")}</h2>
                  <p className="text-xs text-muted-foreground">{t("modules.dashboard.stayOnTrack")}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.key}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-accent/50 transition-colors"
                  >
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.done ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {t(`modules.dashboard.tasks.${task.key}`)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="rounded-full text-xs shrink-0">
                      {task.due}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">{t("modules.dashboard.achievements")}</h2>
                  <p className="text-xs text-muted-foreground">{t("modules.dashboard.badgesEarned")}</p>
                </div>
                <Badge className="rounded-full gradient-brand text-white border-0">
                  {t("modules.dashboard.level")} 12
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((a, i) => (
                  <motion.div
                    key={a.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex flex-col items-center text-center gap-2 rounded-xl border border-border/60 p-3 hover:shadow-glow transition-shadow"
                  >
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${a.color} shadow-elegant`}
                    >
                      <a.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium truncate w-full">
                      {t(`modules.dashboard.achievementLabels.${a.key}`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-base font-semibold mb-4">{t("modules.dashboard.quickActions")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((q) => (
                <Link key={q.key} to={q.to}>
                  <button
                    className="w-full group flex flex-col items-start gap-3 rounded-xl border border-border/60 p-4 text-left hover:border-transparent hover:gradient-brand hover:text-white transition-all"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary group-hover:bg-white/20 transition-colors">
                      <q.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">{t(`modules.dashboard.quick.${q.key}`)}</span>
                  </button>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{t("modules.dashboard.todaysGoal")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t("modules.dashboard.todaysGoalDesc")}</p>
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-muted-foreground">2 {t("modules.dashboard.ofDone")} 3 {t("modules.dashboard.doneShort")}</span>
              <span className="font-semibold">66%</span>
            </div>
            <Progress value={66} className="h-2" />
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 gradient-brand opacity-10 pointer-events-none" />
            <Quote className="h-6 w-6 text-primary mb-3" />
            <p className="text-sm font-medium leading-relaxed">"{t("modules.dashboard.quote")}"</p>
            <p className="text-xs text-muted-foreground mt-2">{t("modules.dashboard.quoteAuthor")}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{t("modules.dashboard.aiMentorTips")}</h3>
            </div>
            <ul className="space-y-3">
              {tips.map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full gradient-brand shrink-0" />
                  <span className="text-muted-foreground">{t(`modules.dashboard.tips.${k}`)}</span>
                </li>
              ))}
            </ul>
            <Link to="/ai-mentor">
              <Button variant="outline" size="sm" className="w-full rounded-full mt-4">
                {t("modules.dashboard.chatWithMentor")}
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}
