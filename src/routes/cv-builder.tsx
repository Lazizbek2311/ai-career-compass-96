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
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/lib/user";

export const Route = createFileRoute("/cv-builder")({
  head: () => ({ meta: [{ title: "CV Builder — CareerAI" }] }),
  component: CvPage,
});

const STEP_KEYS = ["personal", "experience", "education", "skills"] as const;

function CvPage() {
  const { t } = useI18n();
  const { displayName, user } = useUser();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: displayName, title: "", email: user.email, phone: "", location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const filled = Object.values(data).filter((v) => v.trim().length > 0).length;
  const ats = Math.min(98, 40 + filled * 6);

  const update = (k: keyof typeof data, v: string) => setData({ ...data, [k]: v });

  const downloadHTML = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${data.name} — CV</title><style>body{font-family:Inter,system-ui,sans-serif;max-width:780px;margin:40px auto;padding:0 24px;color:#111}h1{margin:0;font-size:28px}h2{border-bottom:1px solid #ddd;padding-bottom:4px;margin-top:24px;font-size:16px;text-transform:uppercase;letter-spacing:.06em;color:#555}.muted{color:#666;font-size:13px}pre{white-space:pre-wrap;font-family:inherit;margin:8px 0}</style></head><body><h1>${data.name}</h1><p class="muted">${data.title} · ${data.email} · ${data.phone} · ${data.location}</p><h2>${t("cv.summary")}</h2><pre>${data.summary}</pre><h2>${t("cv.steps.experience")}</h2><pre>${data.experience}</pre><h2>${t("cv.steps.education")}</h2><pre>${data.education}</pre><h2>${t("cv.steps.skills")}</h2><pre>${data.skills}</pre></body></html>`;
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
              <Badge className="rounded-full">{t("cv.badge")}</Badge>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t("pages.cv.title")}</h1>
              <p className="mt-2 text-muted-foreground">{t("cv.subtitle")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("cv.atsScore")}</p>
              <p className="text-3xl font-bold gradient-brand bg-clip-text text-transparent">{ats}</p>
            </div>
          </div>
          <div className="mt-5">
            <Progress value={((step + 1) / STEP_KEYS.length) * 100} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              {STEP_KEYS.map((s, i) => <span key={s} className={i === step ? "text-foreground font-semibold" : ""}>{t(`cv.steps.${s}`)}</span>)}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 shadow-elegant space-y-4">
            {step === 0 && <>
              <Label>{t("cv.fullName")}</Label><Input value={data.name} onChange={(e) => update("name", e.target.value)} />
              <Label>{t("cv.titleLbl")}</Label><Input value={data.title} onChange={(e) => update("title", e.target.value)} />
              <Label>{t("cv.email")}</Label><Input value={data.email} onChange={(e) => update("email", e.target.value)} />
              <Label>{t("cv.phone")}</Label><Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
              <Label>{t("cv.location")}</Label><Input value={data.location} onChange={(e) => update("location", e.target.value)} />
              <Label>{t("cv.summary")}</Label><Textarea rows={3} value={data.summary} onChange={(e) => update("summary", e.target.value)} />
            </>}
            {step === 1 && <><Label>{t("cv.steps.experience")}</Label><Textarea rows={10} value={data.experience} onChange={(e) => update("experience", e.target.value)} /></>}
            {step === 2 && <><Label>{t("cv.steps.education")}</Label><Textarea rows={10} value={data.education} onChange={(e) => update("education", e.target.value)} /></>}
            {step === 3 && <><Label>{t("cv.skillsHelp")}</Label><Textarea rows={6} value={data.skills} onChange={(e) => update("skills", e.target.value)} />
              <div className="glass rounded-2xl p-4 border border-primary/30">
                <p className="text-xs font-semibold flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" />{t("cv.aiSuggestion")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("cv.aiSuggestionText")}</p>
              </div>
            </>}
            <div className="flex justify-between pt-2">
              <Button variant="outline" className="rounded-full" disabled={step === 0} onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />{t("common.back")}
              </Button>
              {step < STEP_KEYS.length - 1 ? (
                <Button className="rounded-full gradient-brand text-white border-0" onClick={() => setStep(step + 1)}>
                  {t("common.next")}<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button className="rounded-full gradient-brand text-white border-0" onClick={downloadHTML}>
                  <Download className="h-4 w-4 mr-1.5" />{t("cv.export")}
                </Button>
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-elegant">
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />{t("cv.livePreview")}</div>
            <div className="bg-card rounded-2xl p-6 border border-border/60 text-sm space-y-3">
              <h2 className="text-2xl font-bold">{data.name}</h2>
              <p className="text-muted-foreground text-xs">{data.title} · {data.email} · {data.phone} · {data.location}</p>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">{t("cv.summary")}</p><p className="whitespace-pre-wrap">{data.summary}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">{t("cv.steps.experience")}</p><p className="whitespace-pre-wrap">{data.experience}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">{t("cv.steps.education")}</p><p className="whitespace-pre-wrap">{data.education}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-1">{t("cv.steps.skills")}</p><p>{data.skills}</p></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
