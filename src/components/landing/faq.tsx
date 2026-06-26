import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What is CareerAI?", a: "CareerAI is an AI-powered career guidance platform that helps you discover the best career based on your interests, personality, skills, goals, and salary potential." },
  { q: "Is CareerAI free to start?", a: "Yes. You can take the AI career test and explore your top career matches completely free. Premium plans unlock advanced roadmaps and coaching." },
  { q: "How accurate is the AI?", a: "Our models combine assessments with labor market data from 50+ countries, continuously improving accuracy with every user interaction." },
  { q: "Which languages are supported?", a: "CareerAI is currently available in English and Uzbek, with more languages coming soon." },
  { q: "Can I use CareerAI as a working professional?", a: "Absolutely. CareerAI supports students, graduates, and professionals considering a career change at any stage." },
  { q: "Is my data private?", a: "Your data is encrypted and never sold. You can request deletion at any time from your dashboard." },
];

export function FAQ() {
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
            FAQ
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Questions, <span className="gradient-text">answered</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border bg-card px-5 data-[state=open]:shadow-elegant"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
