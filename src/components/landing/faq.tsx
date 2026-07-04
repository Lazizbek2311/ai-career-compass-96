import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

const keys = ["q1", "q2", "q3", "q4", "q5", "q6"];

export function FAQ() {
  const { t } = useI18n();
  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-accent/30">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            {t("landing.faq.badge")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {t("landing.faq.titleA")} <span className="gradient-text">{t("landing.faq.titleB")}</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {keys.map((k, i) => (
            <AccordionItem
              key={k}
              value={`item-${i}`}
              className="rounded-2xl border bg-card px-5 data-[state=open]:shadow-elegant"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {t(`landing.faq.${k}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {t(`landing.faq.${k}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
