import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "CareerAI helped me move from confusion to clarity in a single weekend. The roadmap is unreal.",
    name: "Aziza R.",
    role: "Computer Science Student",
    initials: "AR",
  },
  {
    quote: "The salary analytics and university finder saved me months of research. Worth every minute.",
    name: "Marcus L.",
    role: "Recent Graduate",
    initials: "ML",
  },
  {
    quote: "I switched careers at 32 thanks to the AI mentor and interview coach. Life-changing product.",
    name: "Sofia D.",
    role: "Product Designer",
    initials: "SD",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            Loved by learners
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Trusted by people <span className="gradient-text">building their future</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border bg-card p-6 hover:shadow-elegant transition-all"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[var(--brand)] text-[var(--brand)]" />
                ))}
              </div>
              <p className="text-base leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
