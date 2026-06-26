import { motion } from "motion/react";
import { Briefcase, GraduationCap, Globe2, Cpu, MessageCircle, Map } from "lucide-react";

const stats = [
  { icon: Briefcase, value: "100+", label: "Career Paths" },
  { icon: GraduationCap, value: "200+", label: "Universities" },
  { icon: Globe2, value: "50+", label: "Countries" },
  { icon: Cpu, value: "AI", label: "Powered" },
  { icon: MessageCircle, value: "24/7", label: "Career Mentor" },
  { icon: Map, value: "1:1", label: "Personalized Roadmaps" },
];

export function Stats() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-2xl border bg-card p-5 hover:shadow-elegant transition-all hover:-translate-y-0.5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand mb-3 shadow-glow">
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
