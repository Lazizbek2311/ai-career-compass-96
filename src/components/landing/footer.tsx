import { Sparkles, Twitter, Github, Linkedin, Instagram } from "lucide-react";

const cols = [
  { title: "Product", links: ["Features", "AI Career Test", "Roadmaps", "Pricing"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Legal", links: ["Privacy Policy", "Terms", "Cookies", "Security"] },
];

export function Footer() {
  return (
    <footer className="relative border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">CareerAI</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              AI-powered career guidance for students and professionals. Discover, plan, and build the career you deserve.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border hover:gradient-brand hover:text-white hover:border-transparent transition-all"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold tracking-tight">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with care for the next generation.</p>
        </div>
      </div>
    </footer>
  );
}
