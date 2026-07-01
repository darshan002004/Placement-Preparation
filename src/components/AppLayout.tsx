import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Sparkles, MessageSquare, LogOut,
  ClipboardCheck, User, BookOpen, FileText, MessageCircleQuestion,
  TrendingUp, Menu, X, GraduationCap, Bell, Search, Mic,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navSections: { label: string; items: { to: string; label: string; icon: any }[] }[] = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/profile", label: "Profile", icon: User },
      { to: "/insights", label: "Insights", icon: TrendingUp },
    ],
  },
  {
    label: "Prepare",
    items: [
      { to: "/assessment", label: "Assessment", icon: ClipboardCheck },
      { to: "/prep-plan", label: "AI Prep Plan", icon: Sparkles },
      { to: "/mock-interview", label: "Mock Interview", icon: MessageCircleQuestion },
      { to: "/resume", label: "Resume Review", icon: FileText },
    ],
  },
  {
    label: "Discover",
    items: [
      { to: "/companies", label: "Companies", icon: Building2 },
      { to: "/resources", label: "Resources", icon: BookOpen },
      { to: "/about", label: "Pre-Placement Talk", icon: Mic },
      { to: "/chat", label: "AI Mentor", icon: MessageSquare },
    ],
  },
];

const flatNav = navSections.flatMap((s) => s.items);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const current = flatNav.find((i) => i.to === location.pathname);
  const initials = (user?.email?.[0] || "U").toUpperCase();

  const SidebarInner = (
    <>
      <Link to="/dashboard" className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-base font-bold text-white">PlaceMentor</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/70">Career OS</div>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-5">
        {navSections.map((sec) => (
          <div key={sec.label}>
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {sec.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-smooth",
                      active
                        ? "bg-sidebar-accent text-white"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-sidebar-primary" />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-white">{user?.email?.split("@")[0]}</div>
            <div className="truncate text-[10px] text-sidebar-foreground/70">{user?.email}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground animate-fade-in-up">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded p-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
              <X className="h-4 w-4" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" className="lg:hidden -ml-2" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">PlaceMentor</div>
              <div className="font-display text-sm font-bold truncate">{current?.label || "Workspace"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground w-64">
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Search modules…</span>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </div>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
