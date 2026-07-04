import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function CTA() {
  const { t } = useI18n();
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl gradient-brand p-10 sm:p-16 text-center shadow-elegant"
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {t("landing.cta.title")}
            </h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto text-base sm:text-lg">
              {t("landing.cta.desc")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90 h-12 px-6 group">
                {t("common.startFree")}
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-12 px-6 bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white">
                {t("common.contactSales")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
