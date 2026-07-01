import { useEffect, useState } from "react";
import { MessageCircleQuestion, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ROUNDS = ["Aptitude", "Coding / DSA", "CS Core (OS/DBMS/CN/OOP)", "System Design", "HR / Behavioral"];
const DIFFS = ["Easy", "Medium", "Hard"];

export default function MockInterview() {
  const [companies, setCompanies] = useState<{ name: string }[]>([]);
  const [company, setCompany] = useState("");
  const [round, setRound] = useState("Coding / DSA");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  useEffect(() => {
    supabase.from("companies").select("name").order("name").then(({ data }) => {
      setCompanies(data || []);
      if (data?.[0]) setCompany(data[0].name);
    });
  }, []);

  const generate = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { data, error } = await supabase.functions.invoke("mock-interview", {
        body: { company, round, difficulty, count },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setOutput(data.questions);
      toast.success("Mock questions ready!");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <MessageCircleQuestion className="h-3 w-3" /> AI Mock Interview
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Generate <span className="text-gradient">company-specific</span> mock questions</h1>
        <p className="mt-2 text-muted-foreground">Realistic Qs with ideal approaches & sample answers.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Company</Label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {companies.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Round</Label>
            <Select value={round} onValueChange={setRound}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROUNDS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DIFFS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label># of Questions</Label>
            <Input type="number" min={3} max={10} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 5)} />
          </div>
        </div>
        <Button onClick={generate} disabled={loading || !company} className="mt-5 bg-gradient-hero shadow-elegant">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Questions</>}
        </Button>
      </div>

      {(loading || output) && (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          {loading && <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          {output && (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
