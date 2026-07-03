import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { useI18n, type Lang } from "@/lib/i18n";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const links = [
    { href: "#home", label: t("landing.home") },
    { href: "#features", label: t("landing.features") },
    { href: "#about", label: t("landing.about") },
    { href: "#faq", label: t("landing.faq") },
    { href: "#contact", label: t("landing.contact") },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all ${
            scrolled ? "glass shadow-elegant" : ""
          }`}
        >
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">CareerAI</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-semibold">{lang.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[8rem]">
                <DropdownMenuItem onClick={() => setLang("en" as Lang)}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("uz" as Lang)}>O'zbek</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/login">{t("common.login")}</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full gradient-brand text-white border-0 hover:opacity-90 shadow-elegant">
              <Link to="/dashboard">{t("common.getStarted")}</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 glass rounded-2xl p-4 shadow-elegant"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={() => setLang(lang === "EN" ? "UZ" : "EN")} className="rounded-full gap-1.5">
                  <Globe className="h-4 w-4" /> {lang}
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-full ml-auto">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full gradient-brand text-white border-0">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
