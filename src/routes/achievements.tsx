import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Trophy, Award, Star, Flame, BookOpen, Brain, Target, Sparkles, Medal } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — CareerAI" }] }),
  component: AchPage,
});

const BADGES = [
  { icon: Brain, key: "firstTest", earned: true, color: "from-violet-500 to-purple-500" },
  { icon: BookOpen, key: "learner", earned: true, color: "from-blue-500 to-cyan-500" },
  { icon: Flame, key: "streak7", earned: true, color: "from-orange-500 to-red-500" },
  { icon: Target, key: "goal", earned: true, color: "from-emerald-500 to-teal-500" },
  { icon: Sparkles, key: "chat", earned: false, color: "from-pink-500 to-rose-500" },
  { icon: Award, key: "resume", earned: false, color: "from-amber-500 to-yellow-500" },
  { icon: Medal, key: "interview", earned: false, color: "from-indigo-500 to-blue-500" },
  { icon: Star, key: "streak30", earned: false, color: "from-fuchsia-500 to-pink-500" },
];

const CERTIFICATES = [
  { name: "Python Fundamentals", date: "Mar 2026", issuer: "CareerAI Academy" },
  { name: "AI Career Assessment", date: "Jun 2026", issuer: "CareerAI" },
];

function AchPage() {
  const { t } = useI18n();
  const earned = BADGES.filter((b) => b.earned).length;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <Badge className="rounded-full">{t("modules.achievements.badge")}</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t("modules.achievements.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("modules.achievements.subtitle")}</p>
          <div className="mt-5 flex items-center gap-4">
            <Progress value={(earned / BADGES.length) * 100} className="h-2 flex-1" />
            <span className="text-sm font-semibold">{earned} / {BADGES.length}</span>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b, i) => (
            <motion.div key={b.key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className={`glass rounded-3xl p-5 text-center shadow-elegant ${b.earned ? "" : "opacity-50 grayscale"}`}>
              <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${b.color} grid place-items-center text-white shadow-glow`}>
                <b.icon className="h-7 w-7" />
              </div>
              <p className="mt-3 font-bold">{t(`modules.achievements.badges.${b.key}.name`)}</p>
              <p className="text-xs text-muted-foreground mt-1">{t(`modules.achievements.badges.${b.key}.desc`)}</p>
              {b.earned && <Badge variant="secondary" className="mt-3 rounded-full text-[10px]">{t("modules.achievements.earned")}</Badge>}
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 shadow-elegant">
          <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" />{t("modules.achievements.certificates")}</h2>
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
