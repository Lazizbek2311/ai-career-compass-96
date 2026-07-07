import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/job-finder")({
  head: () => ({ meta: [{ title: "Job Finder — CareerAI" }] }),
  component: JobsPage,
});

type Job = { title: string; company: string; location: string; salary: string; type: string; level: string; tags: string[] };

const JOBS: Job[] = [
  { title: "AI Engineer", company: "OpenAI", location: "San Francisco, USA", salary: "$160k – $230k", type: "Full-time", level: "Mid", tags: ["Python", "PyTorch", "LLMs"] },
  { title: "Machine Learning Engineer", company: "Google", location: "Remote", salary: "$140k – $210k", type: "Full-time", level: "Senior", tags: ["TensorFlow", "GCP"] },
  { title: "Data Scientist", company: "Spotify", location: "Stockholm, Sweden", salary: "€75k – €110k", type: "Full-time", level: "Mid", tags: ["SQL", "Python"] },
  { title: "Backend Developer", company: "Stripe", location: "London, UK", salary: "£70k – £110k", type: "Full-time", level: "Mid", tags: ["Go", "PostgreSQL"] },
  { title: "Frontend Developer", company: "Linear", location: "Remote", salary: "$110k – $160k", type: "Contract", level: "Mid", tags: ["React", "TypeScript"] },
  { title: "Junior Python Developer", company: "Uzum", location: "Tashkent, Uzbekistan", salary: "$800 – $1,500", type: "Full-time", level: "Junior", tags: ["Python", "Django"] },
  { title: "Product Manager — AI", company: "Notion", location: "Remote", salary: "$150k – $200k", type: "Full-time", level: "Senior", tags: ["AI", "Strategy"] },
  { title: "ML Research Intern", company: "DeepMind", location: "London, UK", salary: "£4,500 / mo", type: "Internship", level: "Junior", tags: ["Research"] },
];

function JobsPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [level, setLevel] = useState("All");

  const filtered = useMemo(() => JOBS.filter((j) =>
    (type === "All" || j.type === type) &&
    (level === "All" || j.level === level) &&
    (q === "" || `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q.toLowerCase()))
  ), [q, type, level]);

  const typeLabel = (x: string) => {
    if (x === "All") return t("common.all");
    if (x === "Full-time") return t("modules.jobs.types.fullTime");
    if (x === "Contract") return t("modules.jobs.types.contract");
    if (x === "Internship") return t("modules.jobs.types.internship");
    return x;
  };
  const levelLabel = (x: string) => {
    if (x === "All") return t("common.all");
    if (x === "Junior") return t("modules.jobs.levels.junior");
    if (x === "Mid") return t("modules.jobs.levels.mid");
    if (x === "Senior") return t("modules.jobs.levels.senior");
    return x;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <Badge className="rounded-full">{t("modules.jobs.badge")}</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t("modules.jobs.title")}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">{t("modules.jobs.subtitle")}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("modules.jobs.searchPlaceholder")} className="pl-9 rounded-full" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="rounded-full"><SelectValue>{typeLabel(type)}</SelectValue></SelectTrigger>
              <SelectContent>{["All", "Full-time", "Contract", "Internship"].map((x) => <SelectItem key={x} value={x}>{typeLabel(x)}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="rounded-full"><SelectValue>{levelLabel(level)}</SelectValue></SelectTrigger>
              <SelectContent>{["All", "Junior", "Mid", "Senior"].map((x) => <SelectItem key={x} value={x}>{levelLabel(x)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </motion.div>

        <div className="grid gap-4">
          {filtered.map((j, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass rounded-3xl p-5 shadow-elegant hover:shadow-glow transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl gradient-brand grid place-items-center text-white shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{j.title}</h3>
                    <p className="text-sm text-muted-foreground">{j.company}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>
                      <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />{j.salary}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{typeLabel(j.type)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {j.tags.map((t2) => <Badge key={t2} variant="secondary" className="rounded-full text-xs">{t2}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="rounded-full">{levelLabel(j.level)}</Badge>
                  <Button size="sm" className="rounded-full gradient-brand text-white border-0">{t("modules.jobs.apply")}</Button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">{t("modules.jobs.noResults")}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
