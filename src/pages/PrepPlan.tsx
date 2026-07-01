import { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertCircle, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Company { id: string; name: string; topics: string[]; difficulty: string; pattern: string | null; }
interface Plan { id: string; target_company: string; plan_markdown: string; weeks: number; created_at: string; }

export default function PrepPlan() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [weeks, setWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState<{ aptitude_score: number; coding_score: number; technical_score: number } | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: c }, { data: p }, { data: a }, { data: pr }] = await Promise.all([
        supabase.from("companies").select("id,name,topics,difficulty,pattern").order("name"),
        supabase.from("prep_plans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("assessments").select("aptitude_score,coding_score,technical_score").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);
      setCompanies((c as Company[]) || []);
      setPlans((p as Plan[]) || []);
      setLatest(a as any);
      setProfile(pr);
    })();
  }, [user]);

  const generate = async () => {
    if (!companyId) { toast.error("Pick a company"); return; }
    if (!latest) { toast.error("Take the assessment first"); return; }
    const company = companies.find((c) => c.id === companyId);
    if (!company || !user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-prep-plan", {
        body: { profile, scores: latest, company, weeks },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const { error: insErr } = await supabase.from("prep_plans").insert({
        user_id: user.id, target_company: company.name, plan_markdown: data.plan, weeks,
      });
      if (insErr) throw insErr;
      const { data: refreshed } = await supabase.from("prep_plans").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setPlans((refreshed as Plan[]) || []);
      toast.success("Plan generated!");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    await supabase.from("prep_plans").delete().eq("id", id);
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> AI-Generated Roadmap
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Your <span className="text-gradient">personalized</span> prep plan</h1>
        <p className="mt-2 text-muted-foreground">Based on your skills + the company's drive pattern.</p>
      </div>

      {!latest && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span>Take the skill assessment first so AI can identify your gaps.</span>
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>Target Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="Choose a company" /></SelectTrigger>
              <SelectContent>
                {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} • {c.difficulty}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Weeks of prep</Label>
            <Input type="number" min={1} max={16} value={weeks} onChange={(e) => setWeeks(parseInt(e.target.value) || 4)} />
          </div>
        </div>
        <Button onClick={generate} disabled={loading || !latest} className="mt-5 bg-gradient-hero shadow-elegant">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Crafting your roadmap...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate AI Plan</>}
        </Button>
      </div>

      {plans.length > 0 && (
        <div className="mt-10 space-y-6">
          <h2 className="font-display text-2xl font-bold">Your plans</h2>
          {plans.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold">{p.target_company}</h3>
                  <div className="text-xs text-muted-foreground">{p.weeks} weeks • {new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deletePlan(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="prose prose-sm mt-4 max-w-none dark:prose-invert prose-headings:font-display">
                <ReactMarkdown>{p.plan_markdown}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
