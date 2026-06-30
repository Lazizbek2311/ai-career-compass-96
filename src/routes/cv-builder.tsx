import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Download, Sparkles, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/cv-builder")({
  head: () => ({ meta: [{ title: "CV Builder — CareerAI" }] }),
  component: CvPage,
});

const STEPS = ["Personal", "Experience", "Education", "Skills"] as const;

function CvPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "Lazizbek Karimov", title: "AI Engineer", email: "lazizbek@example.com", phone: "+998 90 000 0000", location: "Tashkent, Uzbekistan",
    summary: "Passionate engineer focused on AI & ML systems.",
    experience: "AI Intern — Acme (2024)\n· Built ML pipelines\n· Improved model accuracy by 12%",
    education: "BSc Computer Science — Inha University (2022–2026)",
    skills: "Python, PyTorch, SQL, React, TypeScript, Communication",
  });

  const filled = Object.values(data).filter((v) => v.trim().length > 0).length;
  const ats = Math.min(98, 40 + filled * 6);

  const update = (k: keyof typeof data, v: string) => setData({ ...data, [k]: v });

  const downloadHTML = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${data.name} — CV</title><style>body{font-family:Inter,system-ui,sans-serif;max-width:780px;margin:40px auto;padding:0 24px;color:#111}h1{margin:0;font-size:28px}h2{border-bottom:1px solid #ddd;padding-bottom:4px;margin-top:24px;font-size:16px;text-transform:uppercase;letter-spacing:.06em;color:#555}.muted{color:#666;font-size:13px}pre{white-space:pre-wrap;font-family:inherit;margin:8px 0}</style></head><body><h1>${data.name}</h1><p class="muted">${data.title} · ${data.email} · ${data.phone} · ${data.location}</p><h2>Summary</h2><pre>${data.summary}</pre><h2>Experience</h2><pre>${data.experience}</pre><h2>Education</h2><pre>${data.education}</pre><h2>Skills</h2><pre>${data.skills}</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.name.replace(/\s+/g, "_")}_CV.html`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge className="rounded-full">Professional CV</Badge>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">CV Builder</h1>
              <p className="mt-2 text-muted-foreground">Craft an ATS-optimized resume with live preview.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">ATS Score</p>
              <p className="text-3xl font-bold gradient-brand bg-clip-text text-transparent">{ats}</p>
            </div>
          </div>
          <div className="mt-5">
            <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              {STEPS.map((s, i) => <span key={s} className={i === step ? "text-foreground font-semibold" : ""}>{s}</span>)}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 shadow-elegant space-y-4">
            {step === 0 && <>
              <Label>Full Name</Label><Input value={data.name} onChange={(e) => update("name", e.target.value)} />
              <Label>Title</Label><Input value={data.title} onChange={(e) => update("title", e.target.value)} />
              <Label>Email</Label><Input value={data.email} onChange={(e) => update("email", e.target.value)} />
              <Label>Phone</Label><Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
              <Label>Location</Label><Input value={data.location} onChange={(e) => update("location", e.target.value)} />
              <Label>Summary</Label><Textarea rows={3} value={data.summary} onChange={(e) => update("summary", e.target.value)} />
            </>}
            {step === 1 && <><Label>Experience</Label><Textarea rows={10} value={data.experience} onChange={(e) => update("experience", e.target.value)} /></>}
            {step === 2 && <><Label>Education</Label><Textarea rows={10} value={data.education} onChange={(e) => update("education", e.target.value)} /></>}
            {step === 3 && <><Label>Skills (comma-separated)</Label><Textarea rows={6} value={data.skills} onChange={(e) => update("skills", e.target.value)} />
              <div className="glass rounded-2xl p-4 border border-primary/30">
                <p className="text-xs font-semibold flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" />AI Suggestion</p>
                <p className="text-xs text-muted-foreground mt-1">Add measurable impact (e.g. "Reduced latency by 30%") and 2–3 keywords from the job description for a higher ATS score.</p>
              </div>
            </>}
            <div className="flex justify-between pt-2">
              <Button variant="outline" className="rounded-full" disabled={step === 0} onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button className="rounded-full gradient-brand text-white border-0" onClick={() => setStep(step + 1)}>
                  Next<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button className="rounded-full gradient-brand text-white border-0" onClick={downloadHTML}>
                  <Download className="h-4 w-4 mr-1.5" />Export
                </Button>
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-elegant">
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />Live Preview</div>
            <div className="bg-card rounded-2xl p-6 border border-border/60 text-sm space-y-3">
              <h2 className="text-2xl font-bold">{data.name}</h2>
              <p className="text-muted-foreground text-xs">{data.title} · {data.email} · {data.phone} · {data.location}</p>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">Summary</p><p className="whitespace-pre-wrap">{data.summary}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">Experience</p><p className="whitespace-pre-wrap">{data.experience}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">Education</p><p className="whitespace-pre-wrap">{data.education}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">Skills</p><p>{data.skills}</p></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
