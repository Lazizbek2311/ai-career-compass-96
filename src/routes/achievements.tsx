import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Trophy, Award, Star, Flame, BookOpen, Brain, Target, Sparkles, Medal } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — CareerAI" }] }),
  component: AchPage,
});

const BADGES = [
  { icon: Brain, name: "First Test", desc: "Completed your first AI Career Test", earned: true, color: "from-violet-500 to-purple-500" },
  { icon: BookOpen, name: "Curious Learner", desc: "Completed 5 lessons", earned: true, color: "from-blue-500 to-cyan-500" },
  { icon: Flame, name: "7-Day Streak", desc: "Studied 7 days in a row", earned: true, color: "from-orange-500 to-red-500" },
  { icon: Target, name: "Goal Setter", desc: "Set your career goal", earned: true, color: "from-emerald-500 to-teal-500" },
  { icon: Sparkles, name: "AI Conversationalist", desc: "Chat 10 times with AI Mentor", earned: false, color: "from-pink-500 to-rose-500" },
  { icon: Award, name: "Resume Pro", desc: "ATS score above 85", earned: false, color: "from-amber-500 to-yellow-500" },
  { icon: Medal, name: "Interview Ace", desc: "Score 90+ on mock interview", earned: false, color: "from-indigo-500 to-blue-500" },
  { icon: Star, name: "30-Day Streak", desc: "Study for 30 days straight", earned: false, color: "from-fuchsia-500 to-pink-500" },
];

const CERTIFICATES = [
  { name: "Python Fundamentals", date: "Mar 2026", issuer: "CareerAI Academy" },
  { name: "AI Career Assessment", date: "Jun 2026", issuer: "CareerAI" },
];

function AchPage() {
  const earned = BADGES.filter((b) => b.earned).length;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <Badge className="rounded-full">Your Journey</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Achievements</h1>
          <p className="mt-2 text-muted-foreground">Earn badges as you progress along your career path.</p>
          <div className="mt-5 flex items-center gap-4">
            <Progress value={(earned / BADGES.length) * 100} className="h-2 flex-1" />
            <span className="text-sm font-semibold">{earned} / {BADGES.length}</span>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className={`glass rounded-3xl p-5 text-center shadow-elegant ${b.earned ? "" : "opacity-50 grayscale"}`}>
              <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${b.color} grid place-items-center text-white shadow-glow`}>
                <b.icon className="h-7 w-7" />
              </div>
              <p className="mt-3 font-bold">{b.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              {b.earned && <Badge variant="secondary" className="mt-3 rounded-full text-[10px]">Earned</Badge>}
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 shadow-elegant">
          <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" />Certificates</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {CERTIFICATES.map((c) => (
              <div key={c.name} className="rounded-2xl border border-border/60 bg-card/50 p-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl gradient-brand grid place-items-center text-white">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.issuer} · {c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
