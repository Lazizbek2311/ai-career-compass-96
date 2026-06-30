import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/salary-analytics")({
  head: () => ({ meta: [{ title: "Salary Analytics — CareerAI" }] }),
  component: SalaryPage,
});

type Country = "USA" | "Canada" | "UK" | "Germany" | "UAE" | "Uzbekistan";
type Role = "AI Engineer" | "Data Scientist" | "Backend Developer" | "Frontend Developer" | "Product Manager";

const DATA: Record<Role, Record<Country, [number, number, number]>> = {
  "AI Engineer": {
    USA: [115000, 165000, 230000], Canada: [85000, 120000, 165000], UK: [70000, 110000, 155000],
    Germany: [65000, 95000, 135000], UAE: [55000, 95000, 140000], Uzbekistan: [9000, 18000, 32000],
  },
  "Data Scientist": {
    USA: [100000, 145000, 200000], Canada: [78000, 110000, 150000], UK: [65000, 95000, 135000],
    Germany: [60000, 88000, 125000], UAE: [50000, 85000, 125000], Uzbekistan: [8000, 16000, 28000],
  },
  "Backend Developer": {
    USA: [90000, 130000, 180000], Canada: [72000, 100000, 140000], UK: [55000, 85000, 120000],
    Germany: [55000, 80000, 115000], UAE: [45000, 75000, 110000], Uzbekistan: [7000, 14000, 25000],
  },
  "Frontend Developer": {
    USA: [80000, 120000, 165000], Canada: [65000, 92000, 128000], UK: [50000, 75000, 110000],
    Germany: [50000, 72000, 105000], UAE: [40000, 68000, 100000], Uzbekistan: [6000, 12000, 22000],
  },
  "Product Manager": {
    USA: [105000, 150000, 210000], Canada: [80000, 115000, 160000], UK: [65000, 100000, 145000],
    Germany: [62000, 92000, 130000], UAE: [55000, 90000, 135000], Uzbekistan: [9000, 18000, 30000],
  },
};

const DEMAND: Record<Role, { level: string; growth: string; color: string }> = {
  "AI Engineer": { level: "Very High", growth: "+38% / yr", color: "from-emerald-500 to-teal-500" },
  "Data Scientist": { level: "High", growth: "+22% / yr", color: "from-blue-500 to-indigo-500" },
  "Backend Developer": { level: "High", growth: "+18% / yr", color: "from-violet-500 to-purple-500" },
  "Frontend Developer": { level: "Moderate", growth: "+12% / yr", color: "from-pink-500 to-rose-500" },
  "Product Manager": { level: "High", growth: "+16% / yr", color: "from-orange-500 to-amber-500" },
};

const COUNTRIES: Country[] = ["USA", "Canada", "UK", "Germany", "UAE", "Uzbekistan"];

function fmt(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`; }

function SalaryPage() {
  const [role, setRole] = useState<Role>("AI Engineer");
  const data = DATA[role];
  const max = Math.max(...COUNTRIES.flatMap((c) => data[c]));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge className="rounded-full">Global Salary Insights</Badge>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Salary Analytics</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">Compare junior, mid and senior compensation across countries.</p>
            </div>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="w-[220px] rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(DATA) as Role[]).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">Demand Level</p>
              <p className={`text-2xl font-bold bg-gradient-to-r ${DEMAND[role].color} bg-clip-text text-transparent`}>{DEMAND[role].level}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground">Job Growth</p>
              <p className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-500" />{DEMAND[role].growth}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((c, i) => {
            const [j, m, s] = data[c];
            return (
              <motion.div key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass rounded-3xl p-5 shadow-elegant">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{c}</h3>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4 space-y-3">
                  {([["Junior", j], ["Mid", m], ["Senior", s]] as const).map(([lab, val]) => (
                    <div key={lab}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{lab}</span>
                        <span className="font-semibold">{fmt(val)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(val / max) * 100}%` }} transition={{ duration: 0.8 }} className="h-full gradient-brand rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
