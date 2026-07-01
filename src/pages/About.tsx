import { Link } from "react-router-dom";
import {
  Mic, Users, Briefcase, GraduationCap, ShieldCheck, Quote,
  CalendarClock, MapPin, Building2, ArrowRight, Sparkles, Target,
  Lightbulb, BadgeCheck, TrendingUp,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const phases = [
  {
    icon: GraduationCap,
    phase: "Phase 1 · 6 months before",
    title: "Foundation & self-audit",
    points: [
      "Take a baseline assessment — know your aptitude, coding, CS-core score honestly.",
      "Lock a target stream: Service company, Product, Core, Analytics, or Higher studies.",
      "Build 1 strong project. Recruiters care about depth, not 6 half-finished repos.",
    ],
  },
  {
    icon: Lightbulb,
    phase: "Phase 2 · 3 months before",
    title: "Skill stacking",
    points: [
      "Daily: 30 min aptitude + 1 DSA problem (easy/medium) + 30 min CS core revision.",
      "Polish resume to a clean 1-pager — quantify everything (X% improvement, Y users).",
      "Attend every Pre-Placement Talk (PPT). Note the panel's role, tech stack & values.",
    ],
  },
  {
    icon: Target,
    phase: "Phase 3 · Drive month",
    title: "Execute & convert",
    points: [
      "Mock interviews 3x/week — coding, system design (for product), HR + behavioural.",
      "Research the company the night before: products, recent news, interview pattern.",
      "Sleep > caffeine. Calm minds crack offers; tired minds miss easy questions.",
    ],
  },
];

const ppt = [
  {
    company: "Google / Microsoft (Product)",
    role: "Software Engineer L3 · ₹25-40 LPA",
    process: ["Online Assessment (2 DSA + 1 system design)", "Phone Screen — DSA + coding fundamentals", "On-site Round 1 — DSA hard + behavioural", "On-site Round 2 — System design (scale a URL shortener)", "On-site Round 3 — Googliness / culture fit"],
    tip: "They test *structured problem solving*. State assumptions, discuss trade-offs, then code.",
  },
  {
    company: "Amazon (Product)",
    role: "SDE-1 · ₹18-28 LPA",
    process: ["OA — 2 coding + work simulation + debugging", "Loop Round 1 — DSA + LP (Leadership Principle)", "Loop Round 2 — System design + LP", "Loop Round 3 — Behavioural deep-dive + LP", "Bar Raiser — Culture & ownership check"],
    tip: "Prepare 8-10 STAR stories mapped to Amazon Leadership Principles. They dig deep.",
  },
  {
    company: "TCS / Infosys / Wipro (Service)",
    role: "Assistant Systems Engineer · ₹3.6-7 LPA",
    process: ["NQT — Aptitude + English + Reasoning (TCS/CoCubes)", "Technical — OOPS, DBMS basics, one project explain", "HR — Relocation, bond (1-2 years), notice period"],
    tip: "Focus on *communication fluency* and confidence. Technical depth is moderate; attitude matters most.",
  },
  {
    company: "Accenture / Cognizant (Service + Consulting)",
    role: "Associate Software Engineer · ₹4.5-8 LPA",
    process: ["Cognitive + Technical Assessment (MeritTrac/AMCAT)", "Group Discussion — current tech topic", "Technical + HR combined — communication, project, cloud basics"],
    tip: "GD is the hidden filter. Speak with data, not opinions. Know basic cloud (AWS/Azure) buzzwords.",
  },
  {
    company: "Deloitte / KPMG (Consulting)",
    role: "Analyst · ₹6-10 LPA",
    process: ["Aptitude + English + Logical (high accuracy needed)", "Case study / group exercise", "2 Behavioural rounds — situational judgement, client handling"],
    tip: "They hire for *client-facing maturity*. Speak slowly, structure answers, show emotional intelligence.",
  },
  {
    company: "Flipkart / Swiggy (Startup Scale)",
    role: "Software Development Engineer · ₹16-25 LPA",
    process: ["Online — 2 DSA + 1 machine coding (build a feature)", "DSA Round — medium/hard, edge cases matter", "System Design — low-level design of a module", "HM Round — product sense + team fit"],
    tip: "Machine coding round is unique. Write clean, extensible code with proper classes and tests.",
  },
  {
    company: "Mu Sigma (Analytics)",
    role: "Decision Scientist · ₹5-7 LPA",
    process: ["Video Synthesis (recorded QA + aptitude)", "Pseudo-code + SQL test", "Case study round — marketing/finance scenario", "HR — stability check, bond discussion"],
    tip: "Case studies are *business-first*. Frame the problem, identify metrics, then suggest a data approach.",
  },
  {
    company: "Zoho / Freshworks (Product Indian)",
    role: "Member Technical Staff · ₹8-15 LPA",
    process: ["Written Round — C output tracing + aptitude + coding (C/C++)", "Technical Round 1 — DSA + puzzles + OS/DBMS", "Technical Round 2 — Project deep-dive + system design", "HR — salary negotiation, location preference"],
    tip: "Written round filters 80% of candidates. Master C/C++ output questions and pointer arithmetic.",
  },
  {
    company: "AMD / Intel / Qualcomm (Core / VLSI)",
    role: "Design Engineer / Verification Engineer · ₹10-18 LPA",
    process: ["Aptitude + Core electronics / digital logic", "Technical — Verilog, computer architecture, pipelining", "Coding — C/C++ for firmware or scripting (Python/Perl)", "HR — long-term commitment to hardware domain"],
    tip: "Core companies love *depth in one subject*. Pick digital design or architecture and go deep, not broad.",
  },
];

const stories = [
  {
    name: "Karan, ECE → SDE",
    quote: "I had 6.8 CGPA and zero confidence. 90 days of structured DSA + mock interviews changed everything. Got 2 product offers.",
  },
  {
    name: "Meera, IT → Analyst",
    quote: "PPT taught me to listen for what the company *actually* values. I tuned my resume to those keywords — first interview, offer.",
  },
  {
    name: "Aditya, CSE → Core",
    quote: "Everyone chased IT. I prepped for core PSUs alongside. Locked a govt-sector role with great work-life balance.",
  },
];

const myths = [
  { wrong: "Only toppers get placed.", right: "Recruiters care about clarity, communication, and one strong project — not just CGPA." },
  { wrong: "I need to know 10 languages.", right: "Master one (Java/Python/C++) + DSA + one framework. Depth > breadth in interviews." },
  { wrong: "Resume length should be 2-3 pages.", right: "Strict 1 page. Recruiters spend 7 seconds on first scan." },
  { wrong: "If I fail one round, I'm done.", right: "Most offers come after 3-5 rejections. Each interview is paid training." },
];

const etiquette = [
  "Arrive 10 minutes early — virtual or in-person.",
  "Dress one notch above casual. Even on Zoom.",
  "Listen fully before answering. A 3-second pause is professional, not weak.",
  "End every round with one thoughtful question for the interviewer.",
  "Send a short thank-you message on LinkedIn within 24 hours.",
];

export default function About() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Mic className="h-3 w-3" /> Pre-Placement Talk
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The placement playbook — from someone who's been on both sides of the table
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Real interview patterns, recruiter expectations, and a 6-month roadmap built from 200+ campus drives. No theory.
          What actually works.
        </p>
      </div>

      {/* What is a PPT */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> What is a Pre-Placement Talk?
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">It's the company auditioning *you* — and you auditioning *them*</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
            A PPT is a 45-60 minute session where a recruiter and a panel of engineers/managers walk you through what the
            company does, what the role looks like, the selection rounds, salary, work culture, and growth ladder. Most
            students treat it as a free hour. Smart students treat it as the most important hour of the entire drive.
            Every question they ask, every word the manager emphasises — that becomes your interview cheat-sheet.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Briefcase, t: "Role clarity", d: "Exact tech stack, team size, work mode." },
              { icon: ShieldCheck, t: "Selection pattern", d: "Number of rounds, elimination criteria." },
              { icon: TrendingUp, t: "Growth & CTC", d: "Salary breakup, bond, promotion cycle." },
              { icon: BadgeCheck, t: "Culture signal", d: "How the panel speaks tells you the team's vibe." },
            ].map((x) => (
              <div key={x.t} className="flex items-start gap-3 rounded-md border border-border bg-background/50 p-3">
                <x.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="text-xs text-muted-foreground">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-gradient-hero p-6 text-primary-foreground shadow-elegant">
          <Sparkles className="h-5 w-5" />
          <h3 className="mt-3 font-display text-xl font-bold">Pro-tip</h3>
          <p className="mt-2 text-sm text-primary-foreground/90 leading-relaxed">
            Sit in the *first three rows*. Maintain eye-contact with the panel. Ask one specific, non-generic question at
            the end (e.g. "How does the team handle code review?"). Recruiters remember faces — by interview day, you're
            already familiar.
          </p>
        </div>
      </section>

      {/* 6-month roadmap */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">The 6-month placement timeline</h2>
        <p className="mt-1 text-sm text-muted-foreground">Honest, paced, and proven.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {phases.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.phase} className="rounded-lg border border-border bg-card p-5 shadow-card hover-lift">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <CalendarClock className="h-3 w-3" /> {p.phase}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{p.title}</h3>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-foreground/85">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real PPT recaps */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Real PPTs · Real selection patterns</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Anonymised summaries from recent campus drives.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {ppt.map((c) => (
            <div key={c.company} className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Campus drive</span>
              </div>
              <h3 className="mt-2 font-display text-lg font-bold">{c.company}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {c.role}
              </div>
              <ol className="mt-4 space-y-2 text-sm">
                {c.process.map((step, i) => (
                  <li key={step} className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-foreground/85">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-md border-l-2 border-primary bg-primary/5 px-3 py-2 text-xs text-foreground/80">
                <span className="font-semibold text-primary">Insider tip · </span>{c.tip}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Myths */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Myths vs reality</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {myths.map((m) => (
            <div key={m.wrong} className="rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="text-xs font-semibold uppercase text-destructive">Myth</div>
              <div className="mt-1 text-sm font-medium line-through text-muted-foreground">{m.wrong}</div>
              <div className="mt-3 text-xs font-semibold uppercase text-primary">Reality</div>
              <div className="mt-1 text-sm font-medium text-foreground">{m.right}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Etiquette */}
      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Interview-day etiquette</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground/85">
            {etiquette.map((e) => (
              <li key={e} className="flex gap-2.5">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Real student experiences</h2>
          <div className="mt-4 space-y-4">
            {stories.map((s) => (
              <div key={s.name} className="rounded-md border-l-2 border-primary bg-muted/30 p-4">
                <Quote className="h-3.5 w-3.5 text-primary" />
                <p className="mt-1 text-sm italic text-foreground/90">"{s.quote}"</p>
                <div className="mt-2 text-xs font-semibold text-primary">— {s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 rounded-lg border border-border bg-gradient-hero p-8 text-center text-primary-foreground shadow-elegant">
        <h3 className="font-display text-2xl font-bold">Now turn knowledge into a score</h3>
        <p className="mt-2 text-sm text-primary-foreground/85">
          Take the 30-question assessment and let the AI build your personal placement plan.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/assessment"><Button variant="secondary">Start Assessment <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          <Link to="/prep-plan"><Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">Generate AI Plan</Button></Link>
        </div>
      </div>
    </AppLayout>
  );
}
