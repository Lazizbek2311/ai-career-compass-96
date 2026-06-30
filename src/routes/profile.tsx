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

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — CareerAI" }] }),
  component: ProfilePage,
});

const KEY = "careerai_profile";
const DEFAULT = {
  name: "Lazizbek Karimov", email: "lazizbek@example.com", education: "BSc Computer Science — Inha University",
  goal: "Become an AI Engineer at a top global tech company",
  interests: "AI, Machine Learning, Robotics, Startups", skills: "Python, PyTorch, SQL, React, English (C1)",
};

function ProfilePage() {
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
    { icon: Brain, label: "AI Tests", value: "3" },
    { icon: BookOpen, label: "Lessons", value: "27" },
    { icon: Trophy, label: "Badges", value: "4" },
    { icon: Flame, label: "Streak", value: "12d" },
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
              <Badge className="rounded-full">Profile</Badge>
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
            <div><Label>Full Name</Label><Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} /></div>
          </div>
          <div><Label>Education</Label><Input value={p.education} onChange={(e) => setP({ ...p, education: e.target.value })} /></div>
          <div><Label>Career Goal</Label><Textarea rows={2} value={p.goal} onChange={(e) => setP({ ...p, goal: e.target.value })} /></div>
          <div><Label>Interests</Label><Textarea rows={2} value={p.interests} onChange={(e) => setP({ ...p, interests: e.target.value })} /></div>
          <div><Label>Skills</Label><Textarea rows={2} value={p.skills} onChange={(e) => setP({ ...p, skills: e.target.value })} /></div>
          <div className="flex justify-end pt-2">
            <Button onClick={save} className="rounded-full gradient-brand text-white border-0">
              <Save className="h-4 w-4 mr-1.5" />{saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
