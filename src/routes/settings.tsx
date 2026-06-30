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

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CareerAI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [lang, setLang] = useState("EN");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [profilePublic, setProfilePublic] = useState(false);
  const [shareData, setShareData] = useState(true);

  useEffect(() => {
    const t = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(t);
  }, []);

  const applyTheme = (t: "light" | "dark") => {
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    try { localStorage.setItem("theme", t); } catch {}
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
          <Badge className="rounded-full">Preferences</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">Customize CareerAI to fit how you work.</p>
        </motion.div>

        <Section icon={Sun} title="Appearance">
          <Row label="Theme" desc="Choose your preferred color mode.">
            <div className="flex gap-2">
              <Button size="sm" variant={theme === "light" ? "default" : "outline"} className="rounded-full" onClick={() => applyTheme("light")}><Sun className="h-4 w-4 mr-1.5" />Light</Button>
              <Button size="sm" variant={theme === "dark" ? "default" : "outline"} className="rounded-full" onClick={() => applyTheme("dark")}><Moon className="h-4 w-4 mr-1.5" />Dark</Button>
            </div>
          </Row>
        </Section>

        <Section icon={Globe} title="Language">
          <Row label="Interface language">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="w-[160px] rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="UZ">O'zbek</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </Section>

        <Section icon={Bell} title="Notifications">
          <Row label="Email notifications" desc="Weekly progress and recommendations."><Switch checked={notifEmail} onCheckedChange={setNotifEmail} /></Row>
          <Row label="Push notifications" desc="Real-time updates in your browser."><Switch checked={notifPush} onCheckedChange={setNotifPush} /></Row>
          <Row label="Marketing emails" desc="Product news and special offers."><Switch checked={notifMarketing} onCheckedChange={setNotifMarketing} /></Row>
        </Section>

        <Section icon={Lock} title="Privacy">
          <Row label="Public profile" desc="Let recruiters discover your profile."><Switch checked={profilePublic} onCheckedChange={setProfilePublic} /></Row>
          <Row label="Improve AI with my data" desc="Anonymized data improves recommendations."><Switch checked={shareData} onCheckedChange={setShareData} /></Row>
        </Section>

        <Section icon={User} title="Account">
          <Row label="Sign out of all devices"><Button size="sm" variant="outline" className="rounded-full">Sign out</Button></Row>
          <Row label="Delete account" desc="Permanently remove your account and data.">
            <Button size="sm" variant="destructive" className="rounded-full"><Trash2 className="h-4 w-4 mr-1.5" />Delete</Button>
          </Row>
        </Section>
      </div>
    </DashboardLayout>
  );
}
