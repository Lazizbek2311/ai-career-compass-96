import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Trophy,
  TrendingUp,
  GraduationCap,
  Wrench,
  HeartHandshake,
  DollarSign,
  Rocket,
  Map as MapIcon,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { CareerReport } from "@/lib/career.functions";

export const Route = createFileRoute("/my-results")({
  head: () => ({
    meta: [
      { title: "My Results — CareerAI" },
      {
        name: "description",
        content:
          "Your personalized AI-generated career report with top matches, salaries, and learning roadmap.",
      },
    ],
  }),
  component: MyResultsPage,
});

type Stored = {
  report: CareerReport;
  generatedAt: string;
  user: { name?: string; country?: string };
};

function MyResultsPage() {
  const [data, setData] = useState<Stored | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("careerai:report");
      if (raw) setData(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {!loaded ? null : !data ? (
          <EmptyState />
        ) : (
          <ReportView data={data} />
        )}
      </div>
    </DashboardLayout>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl border border-border/60 p-10 sm:p-14 text-center shadow-elegant"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-brand shadow-glow mb-5">
        <Brain className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        No results yet
      </h1>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Complete the AI Career Test and our model will craft a personalized
        report tailored to your interests, skills, and goals.
      </p>
      <Button
        asChild
        size="lg"
        className="mt-6 rounded-full h-12 px-7 gradient-brand text-white border-0 hover:opacity-90 shadow-elegant"
      >
        <Link to="/career-test">
          <Sparkles className="h-4 w-4 mr-2" /> Take the AI Career Test
        </Link>
      </Button>
    </motion.div>
  );
}

function ReportView({ data }: { data: Stored }) {
  const { report } = data;
  const top = report.careers[0];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 glass p-6 sm:p-8 shadow-elegant"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full gradient-brand opacity-20 blur-3xl" />
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> AI CAREER REPORT
          <span className="mx-1">•</span>
          <span>{new Date(data.generatedAt).toLocaleDateString()}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight">
          {data.user.name ? `${data.user.name}, your` : "Your"} best-fit career
          is <span className="gradient-text">{top.title}</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">{report.summary}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-full gradient-brand text-white border-0 hover:opacity-90"
          >
            <Link to="/dashboard">
              <Rocket className="h-4 w-4 mr-2" /> Start Learning
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/career-test">Retake test</Link>
          </Button>
        </div>
      </motion.div>

      {/* Strengths / Weaknesses */}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          icon={<CheckCircle2 className="h-4 w-4" />}
          title="Your strengths"
          tone="brand"
        >
          <ul className="space-y-2">
            {report.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full gradient-brand shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          icon={<AlertTriangle className="h-4 w-4" />}
          title="Areas to improve"
        >
          <ul className="space-y-2">
            {report.weaknesses.map((w) => (
              <li key={w} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Careers Tabs */}
      <div className="rounded-3xl border border-border/60 glass p-4 sm:p-6 shadow-elegant">
        <div className="flex items-center gap-2 mb-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Top 5 recommended careers</h2>
            <p className="text-xs text-muted-foreground">
              Ranked by AI-calculated compatibility with your profile
            </p>
          </div>
        </div>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-secondary/60 p-1 rounded-2xl">
            {report.careers.map((c, i) => (
              <TabsTrigger
                key={i}
                value={String(i)}
                className="rounded-xl data-[state=active]:gradient-brand data-[state=active]:text-white data-[state=active]:shadow-elegant px-3 py-2 text-xs sm:text-sm"
              >
                <span className="font-semibold">{c.title}</span>
                <span className="ml-2 text-[10px] opacity-80">{c.match}%</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {report.careers.map((c, i) => (
            <TabsContent key={i} value={String(i)} className="mt-5 space-y-4">
              <CareerDetail c={c} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function CareerDetail({ c }: { c: CareerReport["careers"][number] }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              {c.whyItFits}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">{c.match}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              match
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={c.match} className="h-2" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          icon={<GraduationCap className="h-4 w-4" />}
          title="Recommended university majors"
        >
          <div className="flex flex-wrap gap-2">
            {c.universityMajors.map((m) => (
              <span
                key={m}
                className="rounded-full glass px-3 py-1 text-xs font-medium"
              >
                {m}
              </span>
            ))}
          </div>
        </Panel>

        <Panel
          icon={<TrendingUp className="h-4 w-4" />}
          title="Future demand"
          tone="brand"
        >
          <p className="text-sm text-muted-foreground">{c.futureDemand}</p>
          <div className="mt-3">
            <Progress value={c.demandScore} className="h-2" />
            <div className="mt-1 text-[10px] text-muted-foreground">
              Demand score: {c.demandScore}/100
            </div>
          </div>
        </Panel>

        <Panel icon={<Wrench className="h-4 w-4" />} title="Technical skills">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {c.technicalSkills.map((s) => (
              <li key={s} className="text-sm flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full gradient-brand shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          icon={<HeartHandshake className="h-4 w-4" />}
          title="Soft skills"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {c.softSkills.map((s) => (
              <li key={s} className="text-sm flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Salary */}
      <Panel icon={<DollarSign className="h-4 w-4" />} title="Salary ranges">
        <div className="grid gap-3 sm:grid-cols-3">
          <SalaryCard label="Local" value={c.salary.local} />
          <SalaryCard label="USA" value={c.salary.usa} />
          <SalaryCard label="Europe" value={c.salary.europe} />
        </div>
      </Panel>

      {/* Roadmap */}
      <Panel
        icon={<MapIcon className="h-4 w-4" />}
        title="Personalized learning roadmap"
      >
        <ol className="relative border-l border-border/60 ml-2 space-y-5">
          {c.roadmap.map((p, idx) => (
            <li key={idx} className="ml-5">
              <span className="absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full gradient-brand text-[10px] font-bold text-white shadow-glow">
                {idx + 1}
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h4 className="font-semibold text-sm">{p.phase}</h4>
                <span className="text-[11px] text-muted-foreground">
                  • {p.duration}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{p.focus}</p>
              <ul className="mt-2 space-y-1">
                {p.milestones.map((m) => (
                  <li key={m} className="text-sm flex gap-2">
                    <ArrowRight className="h-3.5 w-3.5 mt-1 text-muted-foreground shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}

function Panel({
  icon,
  title,
  children,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "brand";
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`grid h-7 w-7 place-items-center rounded-lg ${
            tone === "brand"
              ? "gradient-brand text-white"
              : "bg-accent text-foreground"
          }`}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SalaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-base font-bold">{value}</div>
    </div>
  );
}
