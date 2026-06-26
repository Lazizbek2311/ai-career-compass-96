import { motion } from "motion/react";
import { ClipboardCheck, Cpu, Route, Rocket } from "lucide-react";

const steps = [
  { icon: ClipboardCheck, title: "Take AI Career Test", desc: "Answer adaptive questions about your interests, skills, and goals." },
  { icon: Cpu, title: "AI analyzes your profile", desc: "Our models evaluate thousands of signals to find your best-fit careers." },
  { icon: Route, title: "Receive your roadmap", desc: "Get a personalized plan with universities, courses, and milestones." },
  { icon: Rocket, title: "Start learning and grow", desc: "Build skills, track progress, and unlock new opportunities." },
];

export function HowItWorks() {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            How it works
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            From discovery to <span className="gradient-text">your dream career</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Four simple steps. Years of clarity.
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border bg-card p-6 hover:shadow-elegant transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shadow-glow">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs font-bold text-muted-foreground tracking-widest">
                  STEP {i + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
