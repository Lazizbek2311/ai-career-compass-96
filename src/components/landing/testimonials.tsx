import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const items = [
  { key: "t1", name: "Aziza R.", initials: "AR" },
  { key: "t2", name: "Marcus L.", initials: "ML" },
  { key: "t3", name: "Sofia D.", initials: "SD" },
];

export function Testimonials() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            {t("landing.testimonials.badge")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("landing.testimonials.titleA")} <span className="gradient-text">{t("landing.testimonials.titleB")}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
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
              <p className="text-base leading-relaxed">"{t(`landing.testimonials.${it.key}.quote`)}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white text-sm font-bold">
                  {it.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{t(`landing.testimonials.${it.key}.role`)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
