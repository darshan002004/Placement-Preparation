import { FileText, MessageCircleQuestion, BookOpen, ExternalLink, Lightbulb } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const resumeTips = [
  "Use a single-page, ATS-friendly format — no tables, no columns, no images.",
  "Lead each bullet with a strong verb + measurable impact (e.g. 'Cut latency by 40%').",
  "Quantify everything — numbers stand out far more than adjectives.",
  "Tailor the skills section to the JD; mirror the recruiter's keywords.",
  "Keep technical projects above non-technical experience for tech roles.",
  "Run it through Jobscan or Resumeworded before every application.",
];

const interviewQuestions = [
  { round: "HR / Behavioral", qs: ["Tell me about yourself.", "Why this company?", "Describe a conflict you resolved.", "Where do you see yourself in 5 years?", "Strengths & weaknesses with examples."] },
  { round: "Aptitude", qs: ["Time-Speed-Distance word problems", "Probability & permutations", "Number series & coding-decoding", "Data interpretation tables", "Profit/loss & percentages"] },
  { round: "DSA / Coding", qs: ["Reverse a linked list", "Detect cycle in a graph", "LRU cache implementation", "Find Kth largest element", "Longest substring without repeating chars"] },
  { round: "CS Core", qs: ["Process vs Thread", "Indexes in DBMS — pros & cons", "TCP vs UDP handshake", "OOP pillars with real examples", "Deadlock conditions & prevention"] },
  { round: "System Design (entry)", qs: ["Design URL shortener", "Design Instagram feed", "Design rate limiter", "Design parking lot OOP", "Design chat app data model"] },
];

const resources = [
  { topic: "DSA Practice", links: [
    { name: "LeetCode Top Interview 150", url: "https://leetcode.com/studyplan/top-interview-150/" },
    { name: "Striver's SDE Sheet", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
    { name: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
  ]},
  { topic: "Aptitude", links: [
    { name: "IndiaBix", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
    { name: "PrepInsta", url: "https://prepinsta.com/aptitude/" },
  ]},
  { topic: "CS Core", links: [
    { name: "Gate Smashers (YouTube)", url: "https://www.youtube.com/@GateSmashers" },
    { name: "Neso Academy", url: "https://www.youtube.com/@nesoacademy" },
  ]},
  { topic: "System Design", links: [
    { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
    { name: "ByteByteGo", url: "https://bytebytego.com/" },
  ]},
  { topic: "Mock Interviews", links: [
    { name: "Pramp", url: "https://www.pramp.com/" },
    { name: "Interviewing.io", url: "https://interviewing.io/" },
  ]},
];

export default function Resources() {
  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Lightbulb className="h-3 w-3" /> Curated Library
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Resume, interviews & <span className="text-gradient">resources</span></h1>
        <p className="mt-2 text-muted-foreground">Hand-picked guidance to convert prep into offers.</p>
      </div>

      {/* Resume tips */}
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold">Resume tips that actually work</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {resumeTips.map((t) => (
            <li key={t} className="flex gap-3 rounded-xl bg-muted/40 p-4 text-sm">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Interview questions */}
      <section className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary shadow-glow">
            <MessageCircleQuestion className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold">Interview question bank</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {interviewQuestions.map((r) => (
            <div key={r.round} className="rounded-xl border border-border/60 p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">{r.round}</div>
              <ul className="space-y-2 text-sm">
                {r.qs.map((q) => <li key={q} className="text-muted-foreground">• {q}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* External resources */}
      <section className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold">Skill improvement resources</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <div key={r.topic} className="rounded-xl border border-border/60 p-5">
              <div className="mb-3 font-display text-lg font-bold">{r.topic}</div>
              <ul className="space-y-2">
                {r.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      {l.name} <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
