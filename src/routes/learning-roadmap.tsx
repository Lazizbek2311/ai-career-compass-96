import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Circle, PlayCircle, BookOpen, Clock, ExternalLink, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/learning-roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — CareerAI" }] }),
  component: RoadmapPage,
});

type Phase = "Beginner" | "Intermediate" | "Advanced";
type Course = { id: string; phase: Phase; title: string; provider: string; hours: number; url: string };

const defaultCourses: Course[] = [
  { id: "b1", phase: "Beginner", title: "Python for Everybody", provider: "Coursera", hours: 20, url: "https://www.coursera.org/specializations/python" },
  { id: "b2", phase: "Beginner", title: "CS50 Intro to Computer Science", provider: "Harvard / edX", hours: 40, url: "https://cs50.harvard.edu/x/" },
  { id: "b3", phase: "Beginner", title: "Git & GitHub Crash Course", provider: "freeCodeCamp", hours: 4, url: "https://www.freecodecamp.org/" },
  { id: "i1", phase: "Intermediate", title: "Data Structures & Algorithms", provider: "MIT OCW", hours: 30, url: "https://ocw.mit.edu/" },
  { id: "i2", phase: "Intermediate", title: "Machine Learning Specialization", provider: "DeepLearning.AI", hours: 60, url: "https://www.coursera.org/specializations/machine-learning-introduction" },
  { id: "i3", phase: "Intermediate", title: "SQL for Data Analysis", provider: "Mode Analytics", hours: 10, url: "https://mode.com/sql-tutorial/" },
  { id: "a1", phase: "Advanced", title: "Deep Learning Specialization", provider: "DeepLearning.AI", hours: 80, url: "https://www.coursera.org/specializations/deep-learning" },
  { id: "a2", phase: "Advanced", title: "MLOps Engineering", provider: "Google Cloud", hours: 50, url: "https://www.cloudskillsboost.google/" },
  { id: "a3", phase: "Advanced", title: "System Design Interview", provider: "ByteByteGo", hours: 25, url: "https://bytebytego.com/" },
];

function RoadmapPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [career, setCareer] = useState("AI Engineer");

  useEffect(() => {
    try {
      const r = localStorage.getItem("careerai_done");
      if (r) setDone(JSON.parse(r));
      const rep = localStorage.getItem("careerai_report");
      if (rep) {
        const p = JSON.parse(rep);
        setCareer(p?.careers?.[0]?.title ?? p?.topCareers?.[0]?.title ?? "AI Engineer");
      }
    } catch {}
  }, []);

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    localStorage.setItem("careerai_done", JSON.stringify(next));
  };

  const phases: Phase[] = ["Beginner", "Intermediate", "Advanced"];
  const total = defaultCourses.length;
  const completed = Object.values(done).filter(Boolean).length;
  const overall = Math.round((completed / total) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <Badge className="rounded-full">Personalized for {career}</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Your Learning Roadmap</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">A guided path from fundamentals to expert mastery, tailored to your career goal.</p>
          <div className="mt-5 flex items-center gap-4">
            <Progress value={overall} className="h-2 flex-1" />
            <span className="text-sm font-semibold">{overall}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{completed} of {total} milestones complete</p>
        </motion.div>

        {phases.map((phase, pi) => {
          const items = defaultCourses.filter((c) => c.phase === phase);
          const pDone = items.filter((c) => done[c.id]).length;
          const pPct = Math.round((pDone / items.length) * 100);
          return (
            <motion.div key={phase} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.05 }} className="glass rounded-3xl p-6 shadow-elegant">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl gradient-brand grid place-items-center text-white shadow-glow">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{phase} Phase</h2>
                    <p className="text-xs text-muted-foreground">{items.reduce((s, c) => s + c.hours, 0)} hours estimated</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">{pPct}% complete</Badge>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {items.map((c) => {
                  const isDone = !!done[c.id];
                  return (
                    <div key={c.id} className={`rounded-2xl p-4 border transition-all ${isDone ? "bg-primary/5 border-primary/30" : "bg-card/50 border-border/60 hover:border-primary/40"}`}>
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggle(c.id)} className="mt-0.5 shrink-0">
                          {isDone ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>{c.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.provider}</p>
                          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{c.hours}h</span>
                            <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> Resource
                            </a>
                          </div>
                        </div>
                        <Button size="sm" variant={isDone ? "secondary" : "default"} className="rounded-full" onClick={() => toggle(c.id)}>
                          {isDone ? "Done" : <><PlayCircle className="h-3.5 w-3.5 mr-1" />Continue</>}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
