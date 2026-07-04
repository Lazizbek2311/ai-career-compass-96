import { motion } from "motion/react";
import {
  Brain, UserCircle2, LineChart, GraduationCap, Map, FileText,
  MessageSquare, Bot, LayoutDashboard, Languages,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const iconList = [
  { icon: Brain, key: "test" },
  { icon: UserCircle2, key: "personality" },
  { icon: LineChart, key: "salary" },
  { icon: GraduationCap, key: "uni" },
  { icon: Map, key: "roadmap" },
  { icon: FileText, key: "cv" },
  { icon: MessageSquare, key: "interview" },
  { icon: Bot, key: "chat" },
  { icon: LayoutDashboard, key: "dashboard" },
  { icon: Languages, key: "lang" },
];

export function Features() {
  const { t } = useI18n();
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
            {t("landing.features.badge")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("landing.features.titleA")}{" "}
            <span className="gradient-text">{t("landing.features.titleB")}</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {iconList.map((f, i) => (
            <motion.div
              key={f.key}
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
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{t(`landing.features.items.${f.key}.title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`landing.features.items.${f.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
