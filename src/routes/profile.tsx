import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Save, Trophy, Brain, BookOpen, Flame } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useUser } from "@/lib/user";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — CareerAI" }] }),
  component: ProfilePage,
});

const KEY = "careerai_profile";
const DEFAULT = {
  name: "", email: "", education: "",
  goal: "",
  interests: "", skills: "",
};

function ProfilePage() {
  const { t } = useI18n();
  const [p, setP] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setP({ ...DEFAULT, ...JSON.parse(r) }); } catch {}
  }, []);

  const save = () => {
    localStorage.setItem(KEY, JSON.stringify(p));
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };

  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const stats = [
    { icon: Brain, label: t("profile.stats.tests"), value: "3" },
    { icon: BookOpen, label: t("profile.stats.lessons"), value: "27" },
    { icon: Trophy, label: t("profile.stats.badges"), value: "4" },
    { icon: Flame, label: t("profile.stats.streak"), value: "12d" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <div className="flex items-center gap-5 flex-wrap">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="gradient-brand text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Badge className="rounded-full">{t("profile.badge")}</Badge>
              <h1 className="mt-2 text-3xl font-bold">{p.name}</h1>
              <p className="text-sm text-muted-foreground">{p.email}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <s.icon className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="glass rounded-3xl p-6 shadow-elegant space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>{t("profile.fullName")}</Label><Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
            <div><Label>{t("profile.email")}</Label><Input value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} /></div>
          </div>
          <div><Label>{t("profile.education")}</Label><Input value={p.education} onChange={(e) => setP({ ...p, education: e.target.value })} /></div>
          <div><Label>{t("profile.goal")}</Label><Textarea rows={2} value={p.goal} onChange={(e) => setP({ ...p, goal: e.target.value })} /></div>
          <div><Label>{t("profile.interests")}</Label><Textarea rows={2} value={p.interests} onChange={(e) => setP({ ...p, interests: e.target.value })} /></div>
          <div><Label>{t("profile.skills")}</Label><Textarea rows={2} value={p.skills} onChange={(e) => setP({ ...p, skills: e.target.value })} /></div>
          <div className="flex justify-end pt-2">
            <Button onClick={save} className="rounded-full gradient-brand text-white border-0">
              <Save className="h-4 w-4 mr-1.5" />{saved ? t("common.saved") : t("common.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
