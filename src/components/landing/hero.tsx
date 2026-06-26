import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
          <span>Introducing CareerAI 2.0 — smarter than ever</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Discover Your{" "}
          <span className="gradient-text">Perfect Career</span>
          <br className="hidden sm:block" /> with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          CareerAI analyzes your interests, personality, strengths, and goals using
          artificial intelligence to recommend the best career path, learning roadmap,
          universities, salary insights, and future opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" className="rounded-full gradient-brand text-white border-0 hover:opacity-90 shadow-elegant h-12 px-6 group">
            Start Free
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-12 px-6 gap-2 glass">
            <Play className="h-4 w-4" /> Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 mx-auto max-w-5xl"
        >
          <div className="relative rounded-3xl glass shadow-elegant p-2 sm:p-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden gradient-brand">
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-3 p-6">
                <div className="col-span-4 row-span-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 flex flex-col gap-3">
                  <div className="h-2 w-16 rounded-full bg-white/40" />
                  <div className="h-2 w-24 rounded-full bg-white/20" />
                  <div className="mt-2 space-y-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-8 rounded-lg bg-white/10 border border-white/10" />
                    ))}
                  </div>
                </div>
                <div className="col-span-8 row-span-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                  <div className="h-2 w-20 rounded-full bg-white/40 mb-3" />
                  <div className="flex items-end gap-2 h-20">
                    {[40, 65, 50, 80, 55, 90, 70, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
                        className="flex-1 rounded-md bg-white/60"
                      />
                    ))}
                  </div>
                </div>
                <div className="col-span-4 row-span-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                  <div className="h-2 w-12 rounded-full bg-white/40 mb-3" />
                  <div className="text-white/90 text-2xl font-bold">94%</div>
                  <div className="text-white/60 text-xs mt-1">Match Score</div>
                </div>
                <div className="col-span-4 row-span-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
                  <div className="h-2 w-16 rounded-full bg-white/40 mb-3" />
                  <div className="text-white/90 text-2xl font-bold">$128k</div>
                  <div className="text-white/60 text-xs mt-1">Avg Salary</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
