import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, GraduationCap, ExternalLink, Award, DollarSign, Star } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/university-finder")({
  head: () => ({ meta: [{ title: "University Finder — CareerAI" }] }),
  component: UniPage,
});

type Uni = {
  name: string; country: string; field: string; tuition: number; ranking: number;
  scholarship: boolean; requirements: string; url: string;
};

const UNIS: Uni[] = [
  { name: "MIT", country: "USA", field: "AI / CS", tuition: 57000, ranking: 1, scholarship: true, requirements: "SAT 1500+, TOEFL 100+", url: "https://www.mit.edu" },
  { name: "Stanford University", country: "USA", field: "AI / CS", tuition: 56000, ranking: 2, scholarship: true, requirements: "SAT 1500+, TOEFL 100+", url: "https://www.stanford.edu" },
  { name: "Carnegie Mellon", country: "USA", field: "AI / CS", tuition: 58000, ranking: 4, scholarship: true, requirements: "SAT 1480+, strong CS background", url: "https://www.cmu.edu" },
  { name: "University of Toronto", country: "Canada", field: "AI / Data Science", tuition: 45000, ranking: 18, scholarship: true, requirements: "IELTS 6.5+", url: "https://www.utoronto.ca" },
  { name: "University of Waterloo", country: "Canada", field: "CS / Engineering", tuition: 42000, ranking: 24, scholarship: true, requirements: "IELTS 6.5+", url: "https://uwaterloo.ca" },
  { name: "University of Oxford", country: "UK", field: "CS / AI", tuition: 38000, ranking: 3, scholarship: true, requirements: "A*A*A, IELTS 7+", url: "https://www.ox.ac.uk" },
  { name: "Imperial College London", country: "UK", field: "AI / Engineering", tuition: 35000, ranking: 6, scholarship: true, requirements: "A*AA, IELTS 6.5+", url: "https://www.imperial.ac.uk" },
  { name: "TU Munich", country: "Germany", field: "AI / Engineering", tuition: 0, ranking: 22, scholarship: true, requirements: "Abitur equiv., German B2 / English C1", url: "https://www.tum.de" },
  { name: "RWTH Aachen", country: "Germany", field: "Engineering", tuition: 0, ranking: 38, scholarship: true, requirements: "Abitur equiv.", url: "https://www.rwth-aachen.de" },
  { name: "MBZUAI", country: "UAE", field: "AI", tuition: 0, ranking: 45, scholarship: true, requirements: "Bachelor in CS/Math, IELTS 6.5+", url: "https://mbzuai.ac.ae" },
  { name: "Khalifa University", country: "UAE", field: "Engineering / CS", tuition: 22000, ranking: 180, scholarship: true, requirements: "SAT 1100+, IELTS 6.5+", url: "https://www.ku.ac.ae" },
  { name: "Westminster Tashkent", country: "Uzbekistan", field: "CS / Business", tuition: 6500, ranking: 600, scholarship: true, requirements: "IELTS 6+", url: "https://www.wiut.uz" },
  { name: "Inha University Tashkent", country: "Uzbekistan", field: "CS / IT", tuition: 5500, ranking: 700, scholarship: true, requirements: "IELTS 5.5+", url: "https://inha.uz" },
];

function UniPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const [scholar, setScholar] = useState("All");
  const [sort, setSort] = useState("ranking");

  const filtered = useMemo(() => {
    let r = UNIS.filter((u) =>
      (country === "All" || u.country === country) &&
      (scholar === "All" || (scholar === "Yes" ? u.scholarship : !u.scholarship)) &&
      (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.field.toLowerCase().includes(q.toLowerCase()))
    );
    r = [...r].sort((a, b) => sort === "tuition" ? a.tuition - b.tuition : a.ranking - b.ranking);
    return r;
  }, [q, country, scholar, sort]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <Badge className="rounded-full">Find Your University</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">University Finder</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">Search top universities worldwide and compare tuition, ranking and scholarships.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or field..." className="pl-9 rounded-full" />
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["All", "USA", "Canada", "UK", "Germany", "UAE", "Uzbekistan"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">Sort: Ranking</SelectItem>
                <SelectItem value="tuition">Sort: Tuition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex gap-2">
            {["All", "Yes", "No"].map((s) => (
              <Button key={s} size="sm" variant={scholar === s ? "default" : "outline"} className="rounded-full" onClick={() => setScholar(s)}>
                Scholarship: {s}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((u, i) => (
            <motion.div key={u.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass rounded-3xl p-5 shadow-elegant hover:shadow-glow transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl gradient-brand grid place-items-center text-white shrink-0">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{u.name}</h3>
                    <p className="text-xs text-muted-foreground">{u.country} · {u.field}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full"><Star className="h-3 w-3 mr-1" />#{u.ranking}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="glass rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase">Tuition / yr</p>
                  <p className="font-bold flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{u.tuition === 0 ? "Free" : `$${u.tuition.toLocaleString()}`}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase">Scholarship</p>
                  <p className="font-bold flex items-center gap-1"><Award className="h-3.5 w-3.5" />{u.scholarship ? "Available" : "—"}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3"><span className="font-semibold text-foreground">Requirements:</span> {u.requirements}</p>
              <Button asChild size="sm" className="mt-4 rounded-full gradient-brand text-white border-0 w-full">
                <a href={u.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />Visit Website</a>
              </Button>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground col-span-full py-12">No universities match your filters.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
