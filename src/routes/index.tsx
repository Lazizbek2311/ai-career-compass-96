import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerAI — Discover Your Perfect Career with AI" },
      { name: "description", content: "AI-powered career guidance. Personalized roadmaps, university matches, salary insights, and an always-on AI mentor for students and professionals." },
      { property: "og:title", content: "CareerAI — Discover Your Perfect Career with AI" },
      { property: "og:description", content: "AI-powered career guidance. Personalized roadmaps, university matches, salary insights, and an always-on AI mentor." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
