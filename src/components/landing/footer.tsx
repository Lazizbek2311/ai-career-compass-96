import { Sparkles, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  const cols = [
    { title: t("landing.footer.product"), keys: ["features", "test", "roadmaps", "pricing"] },
    { title: t("landing.footer.company"), keys: ["about", "blog", "careers", "contact"] },
    { title: t("landing.footer.legal"), keys: ["privacy", "terms", "cookies", "security"] },
  ];
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
              {t("landing.footer.tagline")}
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
                {c.keys.map((k) => (
                  <li key={k}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {t(`landing.footer.links.${k}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CareerAI. {t("landing.footer.rights")}</p>
          <p className="text-xs text-muted-foreground">{t("landing.footer.built")}</p>
        </div>
      </div>
    </footer>
  );
}
