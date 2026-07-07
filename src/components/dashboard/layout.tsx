import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  ClipboardList,
  Map,
  LineChart,
  GraduationCap,
  Briefcase,
  FileText,
  MessageCircle,
  Sparkles,
  Trophy,
  Calendar as CalendarIcon,
  User,
  Settings,
  Search,
  Bell,
  Globe,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { useI18n, type Lang } from "@/lib/i18n";
import { useUser } from "@/lib/user";
import { useNavigate } from "@tanstack/react-router";

const navItems = [
  { icon: LayoutDashboard, key: "nav.dashboard", to: "/dashboard" },
  { icon: Brain, key: "nav.careerTest", to: "/career-test" },
  { icon: ClipboardList, key: "nav.myResults", to: "/my-results" },
  { icon: Map, key: "nav.roadmap", to: "/learning-roadmap" },
  { icon: LineChart, key: "nav.salary", to: "/salary-analytics" },
  { icon: GraduationCap, key: "nav.universities", to: "/university-finder" },
  { icon: Briefcase, key: "nav.jobs", to: "/job-finder" },
  { icon: FileText, key: "nav.cv", to: "/cv-builder" },
  { icon: FileText, key: "nav.resume", to: "/resume-optimizer" },
  { icon: MessageCircle, key: "nav.interview", to: "/interview-coach" },
  { icon: Sparkles, key: "nav.mentor", to: "/ai-mentor" },
  { icon: Trophy, key: "nav.achievements", to: "/achievements" },
  { icon: CalendarIcon, key: "nav.calendar", to: "/calendar" },
  { icon: User, key: "nav.profile", to: "/profile" },
  { icon: Settings, key: "nav.settings", to: "/settings" },
];

function Sidebar({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const { t } = useI18n();
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col glass border-r border-border/60">
          <div className="flex items-center justify-between px-5 h-16 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">CareerAI</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
              onClick={onClose}
              aria-label={t("app.layout.closeMenu")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {navItems.map((item, idx) => {
              const active = item.to === pathname;
              return (
                <Link
                  key={`${item.key}-${idx}`}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "gradient-brand text-white shadow-elegant"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-border/60">
            <div className="glass rounded-2xl p-4 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full gradient-brand mb-2">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-semibold">{t("topbar.upgradeTitle")}</p>
              <p className="text-[11px] text-muted-foreground mb-2">
                {t("topbar.upgradeDesc")}
              </p>
              <Button
                size="sm"
                className="w-full rounded-full gradient-brand text-white border-0 hover:opacity-90"
              >
                {t("common.upgrade")}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { lang, setLang, t } = useI18n();
  const { displayName, firstName, initials, user, signOut } = useUser();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/60">
      <div className="flex items-center gap-3 h-16 px-4 sm:px-6">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
          onClick={onMenuClick}
          aria-label={t("app.layout.openMenu")}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("topbar.searchPlaceholder")}
            className="pl-9 rounded-full bg-secondary/60 border-border/60"
          />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-semibold hidden sm:inline">{lang.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[8rem]">
              <DropdownMenuItem onClick={() => setLang("en" as Lang)}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("uz" as Lang)}>O'zbek</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full relative" aria-label={t("topbar.notifications")}>
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-accent transition-colors" title={displayName}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="gradient-brand text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">{firstName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold truncate">{displayName}</span>
                  {user.email ? (
                    <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
                  ) : null}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>{t("nav.profile")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>{t("nav.settings")}</DropdownMenuItem>
              <DropdownMenuItem>{t("topbar.billing")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  navigate({ to: "/login" });
                }}
              >
                {t("common.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pathname={pathname}
        />
        <div className="flex-1 min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
