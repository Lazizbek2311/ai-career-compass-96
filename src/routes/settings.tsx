import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun, Globe, Bell, Lock, User, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CareerAI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [profilePublic, setProfilePublic] = useState(false);
  const [shareData, setShareData] = useState(true);

  useEffect(() => {
    const tval = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(tval);
  }, []);

  const applyTheme = (tval: "light" | "dark") => {
    setTheme(tval);
    document.documentElement.classList.toggle("dark", tval === "dark");
    try { localStorage.setItem("theme", tval); } catch {}
  };

  const Section = ({ icon: Icon, title, children }: any) => (
    <div className="glass rounded-3xl p-6 shadow-elegant">
      <h2 className="font-bold text-lg flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );

  const Row = ({ label, desc, children }: any) => (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div><Label className="text-sm">{label}</Label>{desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}</div>
      {children}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 shadow-elegant">
          <Badge className="rounded-full">{t("settings.badge")}</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{t("settings.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("settings.subtitle")}</p>
        </motion.div>

        <Section icon={Sun} title={t("settings.appearance")}>
          <Row label={t("settings.theme")} desc={t("settings.themeDesc")}>
            <div className="flex gap-2">
              <Button size="sm" variant={theme === "light" ? "default" : "outline"} className="rounded-full" onClick={() => applyTheme("light")}><Sun className="h-4 w-4 mr-1.5" />{t("settings.light")}</Button>
              <Button size="sm" variant={theme === "dark" ? "default" : "outline"} className="rounded-full" onClick={() => applyTheme("dark")}><Moon className="h-4 w-4 mr-1.5" />{t("settings.dark")}</Button>
            </div>
          </Row>
        </Section>

        <Section icon={Globe} title={t("settings.language")}>
          <Row label={t("settings.interfaceLang")}>
            <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
              <SelectTrigger className="w-[160px] rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="uz">O'zbek</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </Section>

        <Section icon={Bell} title={t("settings.notifications")}>
          <Row label={t("settings.email")} desc={t("settings.emailDesc")}><Switch checked={notifEmail} onCheckedChange={setNotifEmail} /></Row>
          <Row label={t("settings.push")} desc={t("settings.pushDesc")}><Switch checked={notifPush} onCheckedChange={setNotifPush} /></Row>
          <Row label={t("settings.marketing")} desc={t("settings.marketingDesc")}><Switch checked={notifMarketing} onCheckedChange={setNotifMarketing} /></Row>
        </Section>

        <Section icon={Lock} title={t("settings.privacy")}>
          <Row label={t("settings.publicProfile")} desc={t("settings.publicProfileDesc")}><Switch checked={profilePublic} onCheckedChange={setProfilePublic} /></Row>
          <Row label={t("settings.improveAi")} desc={t("settings.improveAiDesc")}><Switch checked={shareData} onCheckedChange={setShareData} /></Row>
        </Section>

        <Section icon={User} title={t("settings.account")}>
          <Row label={t("settings.signOutAll")}><Button size="sm" variant="outline" className="rounded-full">{t("common.signOut")}</Button></Row>
          <Row label={t("settings.deleteAccount")} desc={t("settings.deleteAccountDesc")}>
            <Button size="sm" variant="destructive" className="rounded-full"><Trash2 className="h-4 w-4 mr-1.5" />{t("common.delete")}</Button>
          </Row>
        </Section>
      </div>
    </DashboardLayout>
  );
}
