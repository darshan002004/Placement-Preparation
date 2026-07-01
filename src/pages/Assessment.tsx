import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Cat = "aptitude" | "coding" | "technical";
interface Q { id: number; cat: Cat; q: string; opts: string[]; ans: number; }

const QUESTIONS: Q[] = [
  // ---------- Aptitude (10) ----------
  { id: 1, cat: "aptitude", q: "If 3 workers build a wall in 6 days, how long for 9 workers?", opts: ["1 day", "2 days", "3 days", "18 days"], ans: 1 },
  { id: 2, cat: "aptitude", q: "What comes next: 2, 6, 12, 20, 30, ?", opts: ["36", "40", "42", "44"], ans: 2 },
  { id: 3, cat: "aptitude", q: "A train 100m long crosses a pole in 10s. Speed?", opts: ["10 m/s", "36 km/h", "Both A & B", "100 km/h"], ans: 2 },
  { id: 10, cat: "aptitude", q: "20% of 250 + 30% of 400 = ?", opts: ["150", "170", "180", "200"], ans: 1 },
  { id: 11, cat: "aptitude", q: "SI on ₹5000 at 8% p.a. for 3 years?", opts: ["₹1000", "₹1200", "₹1400", "₹1500"], ans: 1 },
  { id: 12, cat: "aptitude", q: "Ratio 3:5, sum = 64. Larger number?", opts: ["24", "32", "40", "48"], ans: 2 },
  { id: 13, cat: "aptitude", q: "Average of first 10 natural numbers?", opts: ["4.5", "5", "5.5", "6"], ans: 2 },
  { id: 14, cat: "aptitude", q: "If A:B = 2:3 and B:C = 4:5, then A:C = ?", opts: ["8:15", "2:5", "4:5", "3:5"], ans: 0 },
  { id: 15, cat: "aptitude", q: "A boat travels 30 km upstream in 5h, downstream in 3h. Stream speed?", opts: ["1 km/h", "2 km/h", "3 km/h", "4 km/h"], ans: 1 },
  { id: 16, cat: "aptitude", q: "Probability of getting a prime when rolling a die?", opts: ["1/2", "1/3", "2/3", "1/6"], ans: 0 },

  // ---------- Coding / DSA (10) ----------
  { id: 4, cat: "coding", q: "Time complexity of binary search on N elements?", opts: ["O(N)", "O(log N)", "O(N log N)", "O(1)"], ans: 1 },
  { id: 5, cat: "coding", q: "Which data structure uses LIFO order?", opts: ["Queue", "Stack", "Heap", "Tree"], ans: 1 },
  { id: 6, cat: "coding", q: "Best algorithm for shortest path in weighted graph (no negatives)?", opts: ["BFS", "DFS", "Dijkstra", "Kruskal"], ans: 2 },
  { id: 17, cat: "coding", q: "Worst-case time complexity of QuickSort?", opts: ["O(N log N)", "O(N²)", "O(N)", "O(log N)"], ans: 1 },
  { id: 18, cat: "coding", q: "Which traversal of a BST gives elements in sorted order?", opts: ["Pre-order", "In-order", "Post-order", "Level-order"], ans: 1 },
  { id: 19, cat: "coding", q: "A hash table's average lookup time is?", opts: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 0 },
  { id: 20, cat: "coding", q: "Which DS is best for implementing recursion internally?", opts: ["Queue", "Stack", "Heap", "Graph"], ans: 1 },
  { id: 21, cat: "coding", q: "Number of edges in a tree with N nodes?", opts: ["N", "N-1", "N+1", "2N"], ans: 1 },
  { id: 22, cat: "coding", q: "Which algorithm uses divide-and-conquer?", opts: ["Bubble sort", "Selection sort", "Merge sort", "Insertion sort"], ans: 2 },
  { id: 23, cat: "coding", q: "Memoization is mainly used to optimize?", opts: ["Greedy", "DP", "Backtracking", "Sorting"], ans: 1 },

  // ---------- Technical / CS Core (10) ----------
  { id: 7, cat: "technical", q: "OOP feature: same function name with different signatures?", opts: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], ans: 2 },
  { id: 8, cat: "technical", q: "Which SQL command removes a table structure?", opts: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], ans: 1 },
  { id: 9, cat: "technical", q: "TCP operates at which OSI layer?", opts: ["Network", "Transport", "Session", "Data Link"], ans: 1 },
  { id: 24, cat: "technical", q: "Which is NOT a NoSQL database?", opts: ["MongoDB", "Cassandra", "PostgreSQL", "Redis"], ans: 2 },
  { id: 25, cat: "technical", q: "Default port for HTTPS?", opts: ["80", "443", "21", "22"], ans: 1 },
  { id: 26, cat: "technical", q: "Which OS scheduling algorithm causes starvation most easily?", opts: ["Round Robin", "FCFS", "Priority", "SJF (preemptive)"], ans: 2 },
  { id: 27, cat: "technical", q: "Normalization helps in?", opts: ["Increase redundancy", "Reduce redundancy", "Add columns", "Index data"], ans: 1 },
  { id: 28, cat: "technical", q: "Which is a stateless protocol?", opts: ["FTP", "HTTP", "SMTP", "Telnet"], ans: 1 },
  { id: 29, cat: "technical", q: "RAM is a type of?", opts: ["Secondary memory", "Cache", "Volatile memory", "Read-only memory"], ans: 2 },
  { id: 30, cat: "technical", q: "Which Git command creates a new branch and switches to it?", opts: ["git branch -n", "git checkout -b", "git switch --new", "git make"], ans: 1 },
];

export default function Assessment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const current = QUESTIONS[step];
  const progress = ((step + (done ? 1 : 0)) / QUESTIONS.length) * 100;

  const select = (idx: number) => {
    setAnswers((p) => ({ ...p, [current.id]: idx }));
  };

  const next = async () => {
    if (answers[current.id] === undefined) { toast.error("Pick an option"); return; }
    if (step < QUESTIONS.length - 1) { setStep(step + 1); return; }
    // submit
    setSubmitting(true);
    const scores = { aptitude: 0, coding: 0, technical: 0 };
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.ans) scores[q.cat] += 1;
    });
    // 10 questions per category → score already out of 10
    const apt = scores.aptitude;
    const cod = scores.coding;
    const tec = scores.technical;
    if (user) {
      const { error } = await supabase.from("assessments").insert({
        user_id: user.id, aptitude_score: apt, coding_score: cod, technical_score: tec,
        total_questions: QUESTIONS.length, details: { answers },
      });
      if (error) { toast.error(error.message); setSubmitting(false); return; }
    }
    toast.success("Assessment saved!");
    setDone(true);
    setSubmitting(false);
  };

  if (done) {
    const correct = QUESTIONS.filter((q) => answers[q.id] === q.ans).length;
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl animate-fade-in-up text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-hero shadow-glow">
            <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold">Assessment complete!</h1>
          <p className="mt-2 text-muted-foreground">You scored {correct} out of {QUESTIONS.length}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(["aptitude", "coding", "technical"] as Cat[]).map((c) => {
              const right = QUESTIONS.filter((q) => q.cat === c && answers[q.id] === q.ans).length;
              return (
                <div key={c} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
                  <div className="text-xs font-semibold uppercase text-muted-foreground">{c}</div>
                  <div className="mt-1 font-display text-3xl font-bold text-gradient">{right}/10</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate("/prep-plan")} className="bg-gradient-hero shadow-elegant">
              Get my AI Prep Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ClipboardCheck className="h-3 w-3" /> Skill Assessment
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold">Question {step + 1} of {QUESTIONS.length}</h1>
          <Progress value={progress} className="mt-4 h-2" />
          <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{current.cat}</div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-card">
          <h2 className="font-display text-xl font-semibold">{current.q}</h2>
          <div className="mt-6 space-y-3">
            {current.opts.map((opt, i) => {
              const selected = answers[current.id] === i;
              return (
                <button key={i} onClick={() => select(i)}
                  className={`w-full rounded-xl border p-4 text-left transition-smooth ${
                    selected ? "border-primary bg-primary/5 shadow-elegant" : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {selected && <span className="text-xs">✓</span>}
                    </div>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous</Button>
          <Button onClick={next} disabled={submitting} className="bg-gradient-hero shadow-elegant">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === QUESTIONS.length - 1 ? "Submit" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
