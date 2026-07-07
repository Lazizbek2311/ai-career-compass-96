import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — CareerAI" }] }),
  component: CalPage,
});

type Ev = { date: string; title: string; type: "lesson" | "interview" | "deadline" };
const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const offset = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

const EVENTS: Ev[] = [
  { date: offset(0), title: "Python Lesson — Lists & Dicts", type: "lesson" },
  { date: offset(1), title: "Mock Interview — Technical", type: "interview" },
  { date: offset(3), title: "AI Test Retake", type: "deadline" },
  { date: offset(5), title: "Update CV", type: "deadline" },
  { date: offset(7), title: "ML Course Module 3", type: "lesson" },
  { date: offset(12), title: "HR Mock Interview", type: "interview" },
];

const TYPE_COLOR: Record<Ev["type"], string> = {
  lesson: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  interview: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  deadline: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
};

function CalPage() {
  const { t } = useI18n();
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const grid = useMemo(() => {
    const first = new Date(cursor);
    const startDay = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const weekDates = useMemo(() => {
    const d = new Date(today); d.setDate(d.getDate() - d.getDay());
    return Array.from({ length: 7 }, (_, i) => { const n = new Date(d); n.setDate(d.getDate() + i); return n; });
  }, []);

  const monthLabel = cursor.toLocaleString("en", { month: "long", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge className="rounded-full">{t("modules.calendar.badge")}</Badge>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t("modules.calendar.title")}</h1>
              <p className="mt-2 text-muted-foreground">{t("modules.calendar.subtitle")}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={view === "month" ? "default" : "outline"} className="rounded-full" onClick={() => setView("month")}>{t("modules.calendar.month")}</Button>
              <Button size="sm" variant={view === "week" ? "default" : "outline"} className="rounded-full" onClick={() => setView("week")}>{t("modules.calendar.week")}</Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-elegant">
            {view === "month" ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                  <h2 className="font-bold">{monthLabel}</h2>
                  <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground uppercase mb-2">
                  {(["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const).map((d) => <div key={d}>{t(`modules.calendar.weekdays.${d}`)}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {grid.map((d, i) => {
                    if (!d) return <div key={i} className="aspect-square" />;
                    const key = iso(d);
                    const evs = EVENTS.filter((e) => e.date === key);
                    const isToday = key === iso(today);
                    return (
                      <div key={i} className={`aspect-square rounded-xl p-1.5 text-xs border ${isToday ? "border-primary bg-primary/10" : "border-border/40 bg-card/30"}`}>
                        <p className={`font-semibold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</p>
                        <div className="mt-0.5 space-y-0.5">
                          {evs.slice(0, 2).map((e, j) => <div key={j} className={`truncate rounded px-1 text-[9px] ${TYPE_COLOR[e.type]}`}>{e.title}</div>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <h2 className="font-bold mb-3">{t("modules.calendar.thisWeek")}</h2>
                {weekDates.map((d) => {
                  const key = iso(d);
                  const evs = EVENTS.filter((e) => e.date === key);
                  return (
                    <div key={key} className="rounded-2xl border border-border/60 p-3 bg-card/40">
                      <p className="text-xs font-semibold">{d.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</p>
                      {evs.length === 0 && <p className="text-xs text-muted-foreground mt-1">{t("modules.calendar.noEvents")}</p>}
                      {evs.map((e, i) => <Badge key={i} variant="secondary" className={`mt-2 mr-2 rounded-full ${TYPE_COLOR[e.type]}`}>{e.title}</Badge>)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass rounded-3xl p-6 shadow-elegant">
            <h2 className="font-bold mb-3 flex items-center gap-2"><CalIcon className="h-4 w-4" />{t("modules.calendar.upcoming")}</h2>
            <div className="space-y-2">
              {EVENTS.slice(0, 6).map((e, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-card/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{e.title}</p>
                    <Badge variant="secondary" className={`rounded-full text-[10px] ${TYPE_COLOR[e.type]}`}>{t(`modules.calendar.types.${e.type}`)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{e.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
