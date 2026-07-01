import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Loader2, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string; name: string; logo_emoji: string | null; roles: string[]; topics: string[];
  difficulty: string; pattern: string | null; ctc: string | null; description: string | null;
}

const diffColor: Record<string, string> = {
  Easy: "bg-accent/15 text-accent border-accent/30",
  Medium: "bg-secondary/15 text-secondary-foreground border-secondary/30",
  Hard: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    supabase.from("companies").select("*").order("name").then(({ data }) => {
      setCompanies((data as Company[]) || []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "All" ? companies : companies.filter((c) => c.difficulty === filter);

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Building2 className="h-3 w-3" /> Past Placement Drives
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Company <span className="text-gradient">Knowledge Base</span></h1>
        <p className="mt-2 text-muted-foreground">Topics, patterns and difficulty from previous campus drives.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Easy", "Medium", "Hard"].map((d) => (
          <button key={d} onClick={() => setFilter(d)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth ${
              filter === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}>{d}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c, i) => (
            <Link key={c.id} to={`/companies/${c.id}`} className="animate-fade-in-up block rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-card text-2xl shadow-card">{c.logo_emoji}</div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{c.name}</h3>
                    <div className="text-sm text-muted-foreground">{c.ctc}</div>
                  </div>
                </div>
                <Badge variant="outline" className={diffColor[c.difficulty] || ""}>{c.difficulty}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roles</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {c.roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Topics</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {c.topics.map((t) => <Badge key={t} variant="outline" className="border-primary/30 bg-primary/5 text-primary">{t}</Badge>)}
                </div>
              </div>
              {c.pattern && (
                <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Pattern: </span>{c.pattern}
                </div>
              )}
              <div className="mt-4 flex items-center justify-end text-xs font-semibold text-primary">View details <ArrowRight className="ml-1 h-3 w-3" /></div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
