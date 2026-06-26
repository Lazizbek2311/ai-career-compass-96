import { motion } from "motion/react";
import {
  Brain, UserCircle2, LineChart, GraduationCap, Map, FileText,
  MessageSquare, Bot, LayoutDashboard, Languages,
} from "lucide-react";

const features = [
  { icon: Brain, title: "AI Career Test", desc: "Adaptive assessment that learns from each answer to surface your ideal field." },
  { icon: UserCircle2, title: "AI Personality Analysis", desc: "Deep personality insights mapped to career fit and team dynamics." },
  { icon: LineChart, title: "Salary Analytics", desc: "Real-time salary benchmarks across roles, regions, and seniority levels." },
  { icon: GraduationCap, title: "University Finder", desc: "Discover programs across 50+ countries matched to your goals." },
  { icon: Map, title: "Learning Roadmap", desc: "Step-by-step path with courses, projects, and milestones." },
  { icon: FileText, title: "AI CV Builder", desc: "Generate polished, ATS-ready resumes tailored to each role." },
  { icon: MessageSquare, title: "AI Interview Coach", desc: "Practice real questions and get instant, expert feedback." },
  { icon: Bot, title: "AI Chat Assistant", desc: "Always-on mentor for guidance, decisions, and motivation." },
  { icon: LayoutDashboard, title: "Progress Dashboard", desc: "Track skills, courses, and career readiness over time." },
  { icon: Languages, title: "Multi-language Support", desc: "Native experience in English, Uzbek, and more languages." },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            Features
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">choose your future</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            A complete suite of AI tools built for students, graduates, and professionals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              className="group relative rounded-2xl border bg-card p-6 hover:shadow-elegant transition-all hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full gradient-brand opacity-0 group-hover:opacity-10 transition-opacity blur-2xl" />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent group-hover:gradient-brand transition-all">
                  <f.icon className="h-5 w-5 group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
