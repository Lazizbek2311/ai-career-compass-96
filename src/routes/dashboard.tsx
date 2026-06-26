import { createFileRoute } from "@tanstack/react-router";
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

const stats = [
  { label: "Career Match", value: "98%", icon: Target, color: "from-violet-500 to-fuchsia-500" },
  { label: "Lessons Done", value: "127", icon: BookOpen, color: "from-sky-500 to-cyan-500" },
  { label: "Skills Learned", value: "34", icon: Brain, color: "from-emerald-500 to-teal-500" },
  { label: "AI Sessions", value: "412", icon: Sparkles, color: "from-amber-500 to-orange-500" },
  { label: "Certificates", value: "9", icon: Award, color: "from-rose-500 to-pink-500" },
  { label: "Daily Streak", value: "28d", icon: Flame, color: "from-orange-500 to-red-500" },
];

const careers = [
  { name: "AI Engineer", match: 98, salary: "$140k", trend: "+12%" },
  { name: "Data Scientist", match: 95, salary: "$125k", trend: "+9%" },
  { name: "Backend Developer", match: 92, salary: "$118k", trend: "+7%" },
];

const skills = [
  { name: "Python", value: 86 },
  { name: "Mathematics", value: 72 },
  { name: "English", value: 91 },
  { name: "Problem Solving", value: 78 },
];

const salaries = [
  { country: "Uzbekistan", flag: "🇺🇿", value: "$24,000", note: "per year" },
  { country: "United States", flag: "🇺🇸", value: "$140,000", note: "per year" },
  { country: "Germany", flag: "🇩🇪", value: "€85,000", note: "per year" },
];

const tasks = [
  { label: "Finish Python Lesson 12", done: false, due: "Today" },
  { label: "Complete AI Personality Test", done: false, due: "Tomorrow" },
  { label: "Update CV with new project", done: true, due: "Done" },
  { label: "Practice mock interview", done: false, due: "Fri" },
];

const achievements = [
  { label: "Fast Learner", icon: Zap, color: "from-amber-400 to-orange-500" },
  { label: "AI Pioneer", icon: Brain, color: "from-violet-500 to-fuchsia-500" },
  { label: "Streak Master", icon: Flame, color: "from-orange-500 to-red-500" },
  { label: "Top 1%", icon: Trophy, color: "from-yellow-400 to-amber-500" },
  { label: "Mentor", icon: Sparkles, color: "from-sky-400 to-cyan-500" },
  { label: "Certified", icon: Award, color: "from-emerald-400 to-teal-500" },
];

const quickActions = [
  { label: "Start AI Test", icon: Brain },
  { label: "Continue Learning", icon: PlayCircle },
  { label: "Ask AI", icon: Sparkles },
  { label: "Build CV", icon: FileText },
];

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progressValues, setProgressValues] = useState(skills.map(() => 0));

  useEffect(() => {
    const t = setTimeout(() => setProgressValues(skills.map((s) => s.value)), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
              {/* Main column */}
              <div className="space-y-6 min-w-0">
                {/* Hero card */}
                <Card className="p-6 sm:p-8 overflow-hidden relative">
                  <div className="absolute inset-0 gradient-brand opacity-[0.08] pointer-events-none" />
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Lazizbek <span className="inline-block">👋</span>
                      </h1>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md">
                        Current goal: <span className="text-foreground font-medium">Become an AI Engineer</span>
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between mb-1.5 text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">68%</span>
                          </div>
                          <Progress value={68} className="h-2" />
                        </div>
                      </div>
                      <div className="mt-5 flex items-start gap-2 rounded-xl bg-background/60 border border-border/60 p-3 max-w-lg">
                        <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          <span className="text-foreground font-medium">AI Tip:</span> Focus on
                          completing the Python module this week to unlock the ML roadmap.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                      <Button className="rounded-full gradient-brand text-white border-0 hover:opacity-90 shadow-elegant">
                        Continue Learning
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button variant="outline" className="rounded-full">
                        View Roadmap
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats.map((s, i) => (
                    <Card key={s.label} delay={0.05 * i} className="p-4 hover:shadow-glow transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                          <p className="text-2xl font-bold mt-1">{s.value}</p>
                        </div>
                        <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${s.color} shadow-elegant`}>
                          <s.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Careers + Skills */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold">Top Career Matches</h2>
                        <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full">Updated today</Badge>
                    </div>
                    <div className="space-y-3">
                      {careers.map((c, i) => (
                        <motion.div
                          key={c.name}
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
                              <p className="text-sm font-semibold truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Avg {c.salary} ·{" "}
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
                        <h2 className="text-base font-semibold">Learning Progress</h2>
                        <p className="text-xs text-muted-foreground">This semester</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="space-y-4">
                      {skills.map((s, i) => (
                        <div key={s.name}>
                          <div className="flex items-center justify-between mb-1.5 text-sm">
                            <span className="font-medium">{s.name}</span>
                            <span className="text-muted-foreground">{s.value}%</span>
                          </div>
                          <Progress value={progressValues[i]} className="h-2 transition-all duration-1000" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Salary preview */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold">Salary Preview</h2>
                      <p className="text-xs text-muted-foreground">Estimated for AI Engineer role</p>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Explore <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {salaries.map((s, i) => (
                      <motion.div
                        key={s.country}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="rounded-xl border border-border/60 p-4 bg-background/40 hover:shadow-elegant transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{s.flag}</span>
                          <span className="text-sm font-medium">{s.country}</span>
                        </div>
                        <p className="text-2xl font-bold gradient-text">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Tasks + Achievements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold">Upcoming Tasks</h2>
                        <p className="text-xs text-muted-foreground">Stay on track</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {tasks.map((t) => (
                        <div
                          key={t.label}
                          className="flex items-center gap-3 rounded-xl border border-border/60 p-3 hover:bg-accent/50 transition-colors"
                        >
                          {t.done ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                t.done ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {t.label}
                            </p>
                          </div>
                          <Badge variant="secondary" className="rounded-full text-xs shrink-0">
                            {t.due}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold">Achievements</h2>
                        <p className="text-xs text-muted-foreground">Badges you've earned</p>
                      </div>
                      <Badge className="rounded-full gradient-brand text-white border-0">
                        Level 12
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {achievements.map((a, i) => (
                        <motion.div
                          key={a.label}
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
                          <p className="text-xs font-medium truncate w-full">{a.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((q) => (
                      <button
                        key={q.label}
                        className="group flex flex-col items-start gap-3 rounded-xl border border-border/60 p-4 text-left hover:border-transparent hover:gradient-brand hover:text-white transition-all"
                      >
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary group-hover:bg-white/20 transition-colors">
                          <q.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{q.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right sidebar */}
              <aside className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Today's Goal</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete 2 Python lessons and finish your weekly AI challenge.
                  </p>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-muted-foreground">2 of 3 done</span>
                    <span className="font-semibold">66%</span>
                  </div>
                  <Progress value={66} className="h-2" />
                </Card>

                <Card className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 gradient-brand opacity-10 pointer-events-none" />
                  <Quote className="h-6 w-6 text-primary mb-3" />
                  <p className="text-sm font-medium leading-relaxed">
                    "The future depends on what you do today."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">— Mahatma Gandhi</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">AI Mentor Tips</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Practice 30 minutes of coding daily.",
                      "Build one mini-project this week.",
                      "Connect with 3 AI engineers on LinkedIn.",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full gradient-brand shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full rounded-full mt-4">
                    Chat with AI Mentor
                  </Button>
                </Card>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
