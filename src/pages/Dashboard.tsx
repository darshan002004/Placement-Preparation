import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ClipboardCheck, Building2, MessageSquare, TrendingUp, Target, Award,
  ArrowRight, Brain, Zap, AlertTriangle, BookOpen,
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar,
} from "recharts";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Profile { full_name: string | null; }
interface Assessment { aptitude_score: number; coding_score: number; technical_score: number; }
interface Snapshot {
  id: string;
  readiness_score: number;
  placement_probability: number;
  aptitude_score: number;
  coding_score: number;
  technical_score: number;
  communication_score: number;
  weak_areas: string[];
  recommended_companies: string[];
  created_at: string;
}
interface CompanyMatch { name: string; logo_emoji?: string; difficulty: string; ctc?: string; fit_percent: number; }

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [latest, setLatest] = useState<Assessment | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [communication, setCommunication] = useState(6);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<{
    placement_probability: number;
    readiness_score: number;
    verdict: string;
    weak_areas: string[];
    top_companies: CompanyMatch[];
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: a }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("assessments").select("aptitude_score,coding_score,technical_score")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("progress_snapshots").select("*")
          .eq("user_id", user.id).order("created_at", { ascending: true }).limit(20),
      ]);
      setProfile(p as Profile | null);
      setLatest(a as Assessment | null);
      setSnapshots((s as Snapshot[]) || []);
      // hydrate latest prediction from most recent snapshot
      const arr = (s as Snapshot[]) || [];
      if (arr.length > 0) {
        const last = arr[arr.length - 1];
        setCommunication(last.communication_score);
      }
    })();
  }, [user]);

  const runPrediction = async () => {
    if (!latest) { toast.error("Take the assessment first"); return; }
    if (!user) return;
    setPredicting(true);
    try {
      const { data: companies } = await supabase
        .from("companies")
        .select("name,logo_emoji,difficulty,topics,ctc");
      const { data, error } = await supabase.functions.invoke("predict-placement", {
        body: {
          aptitude_score: latest.aptitude_score,
          coding_score: latest.coding_score,
          technical_score: latest.technical_score,
          communication_score: communication,
          companies: companies || [],
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPrediction(data);
      // persist snapshot
      await supabase.from("progress_snapshots").insert({
        user_id: user.id,
        readiness_score: data.readiness_score,
        placement_probability: data.placement_probability,
        aptitude_score: latest.aptitude_score,
        coding_score: latest.coding_score,
        technical_score: latest.technical_score,
        communication_score: communication,
        weak_areas: data.weak_areas,
        recommended_companies: (data.top_companies || []).map((c: CompanyMatch) => c.name),
      });
      const { data: refreshed } = await supabase.from("progress_snapshots").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: true }).limit(20);
      setSnapshots((refreshed as Snapshot[]) || []);
      toast.success("Prediction updated & saved!");
    } catch (e: any) {
      toast.error(e.message || "Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const radarData = useMemo(() => latest ? [
    { skill: "Aptitude", score: latest.aptitude_score, full: 10 },
    { skill: "Coding", score: latest.coding_score, full: 10 },
    { skill: "Technical", score: latest.technical_score, full: 10 },
    { skill: "Comm.", score: communication, full: 10 },
  ] : [], [latest, communication]);

  const lineData = useMemo(() => snapshots.map((s, i) => ({
    name: `#${i + 1}`,
    Readiness: s.readiness_score,
    Probability: Number(s.placement_probability),
    date: new Date(s.created_at).toLocaleDateString(),
  })), [snapshots]);

  const greeting = profile?.full_name?.split(" ")[0] || "there";
  const probability = prediction?.placement_probability ?? (snapshots.at(-1)?.placement_probability ?? 0);
  const readiness = prediction?.readiness_score ?? (snapshots.at(-1)?.readiness_score ?? (latest
    ? Math.round(((latest.aptitude_score + latest.coding_score + latest.technical_score) / 30) * 100) : 0));

  const gaugeData = [{ name: "prob", value: Number(probability), fill: "hsl(var(--primary))" }];

  const quickCards = [
    { to: "/assessment", icon: ClipboardCheck, title: "Take Assessment", desc: "Score your skills" },
    { to: "/companies", icon: Building2, title: "Explore Companies", desc: "Past drive patterns" },
    { to: "/prep-plan", icon: Sparkles, title: "AI Prep Plan", desc: "Personalized roadmap" },
    { to: "/resources", icon: BookOpen, title: "Resume & Resources", desc: "Curated playbook" },
  ];

  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-accent">Welcome back</div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
            Hi {greeting} — your career command center
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ML-driven placement prediction · personalized prep · progress tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/assessment"><Button variant="outline" size="sm"><ClipboardCheck className="mr-2 h-4 w-4" />Assessment</Button></Link>
          <Link to="/prep-plan"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90"><Sparkles className="mr-2 h-4 w-4" />AI Prep Plan</Button></Link>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid gap-4 lg:grid-cols-6">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="uppercase tracking-wider">Placement Readiness</span>
            <Target className="h-4 w-4" />
          </div>
          <div className="mt-3 font-display text-4xl font-bold">{readiness}<span className="text-2xl text-muted-foreground">%</span></div>
          <Progress value={readiness} className="mt-4 h-1.5" />
          <p className="mt-3 text-xs text-muted-foreground">Composite of all assessment dimensions.</p>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="uppercase tracking-wider">ML Probability</span>
            <Brain className="h-4 w-4" />
          </div>
          <div className="mt-3 font-display text-4xl font-bold">{Number(probability).toFixed(1)}<span className="text-2xl text-muted-foreground">%</span></div>
          <p className="mt-4 text-xs text-muted-foreground line-clamp-2">{prediction?.verdict || "Run prediction to see verdict."}</p>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="uppercase tracking-wider">Snapshots</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-3 font-display text-4xl font-bold">{snapshots.length}</div>
          <p className="mt-4 text-xs text-muted-foreground">Improvement timeline tracked.</p>
        </div>

        <div className="lg:col-span-4 rounded-lg border border-border bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
            <Zap className="h-3 w-3" /> Logistic Regression Model
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold">AI Placement Predictor</h2>
          <p className="mt-1 max-w-lg text-sm text-primary-foreground/80">
            Combines assessment scores + self-rated communication to predict placement probability and recommend best-fit companies.
          </p>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm"><span>Communication self-rating</span><span className="font-semibold">{communication}/10</span></div>
            <Slider value={[communication]} min={0} max={10} step={1} onValueChange={(v) => setCommunication(v[0])} />
            <Button onClick={runPrediction} disabled={predicting || !latest} className="mt-4 bg-white text-primary hover:bg-white/90">
              {predicting ? "Predicting..." : "Run AI Prediction"}
            </Button>
            {!latest && <p className="mt-2 text-xs text-white/80">Take the assessment first.</p>}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5 shadow-card flex flex-col">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Probability Gauge</div>
          <div className="relative flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={gaugeData} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} fill="hsl(var(--primary))" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-3xl font-bold">{Number(probability).toFixed(0)}%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">predicted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      {latest && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-bold">Skill Radar</h3>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">out of 10</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-bold">Progress over time</h3>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">last {snapshots.length || 0}</span>
            </div>
            {snapshots.length >= 2 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                  <Line type="monotone" dataKey="Readiness" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Probability" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
                Run at least 2 predictions to view your trend.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Focus + companies */}
      {prediction && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-display text-base font-bold">Focus areas</h3>
            </div>
            {prediction.weak_areas.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">All your skills are strong — keep practising mocks.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {prediction.weak_areas.map((w) => (
                  <li key={w} className="flex items-center gap-2 rounded border border-border bg-muted/30 px-3 py-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> {w}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/prep-plan"><Button variant="outline" size="sm" className="mt-4">Generate AI plan <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-display text-base font-bold">Best-fit companies</h3>
            </div>
            <div className="mt-3 space-y-2">
              {prediction.top_companies.map((c) => (
                <div key={c.name} className="flex items-center gap-3 rounded border border-border p-3">
                  <span className="text-xl">{c.logo_emoji || "🏢"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className="text-sm font-bold text-primary">{c.fit_percent}%</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{c.difficulty}{c.ctc ? ` · ${c.ctc}` : ""}</div>
                    <div className="mt-1 h-1 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${c.fit_percent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="mt-10 mb-4 font-display text-lg font-bold">Jump into action</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-bold">{c.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-smooth group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>

      {!latest && (
        <div className="mt-10 rounded-lg border border-primary/20 bg-gradient-hero p-8 text-center shadow-elegant">
          <h3 className="font-display text-2xl font-bold text-primary-foreground">Start with a quick skill assessment</h3>
          <p className="mt-2 text-sm text-primary-foreground/80">30 questions · 10 mins · Get your readiness + ML probability</p>
          <Link to="/assessment"><Button variant="secondary" className="mt-5">Take Assessment <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      )}
    </AppLayout>
  );
}
