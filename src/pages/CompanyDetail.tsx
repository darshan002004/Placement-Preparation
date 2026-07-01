import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Clipboard, GraduationCap, Loader2, MapPin, Sparkles, Target, TrendingUp, ExternalLink } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Company {
  id: string; name: string; logo_emoji: string | null; roles: string[]; topics: string[];
  difficulty: string; pattern: string | null; ctc: string | null; description: string | null;
}

const diffColor: Record<string, string> = {
  Easy: "bg-accent/15 text-accent border-accent/30",
  Medium: "bg-secondary/15 text-secondary-foreground border-secondary/30",
  Hard: "bg-destructive/15 text-destructive border-destructive/30",
};

const careerSites: Record<string, string> = {
  accenture: "https://www.accenture.com/in-en/careers/jobsearch",
  adobe: "https://careers.adobe.com/us/en/search-results",
  amazon: "https://www.amazon.jobs/en/search?base_query=software+development&loc_query=India",
  "amd / intel": "https://careers.amd.com/careers-home/jobs",
  capgemini: "https://www.capgemini.com/in-en/careers/join-us/",
  cognizant: "https://careers.cognizant.com/india-en/jobs/",
  deloitte: "https://jobsindia.deloitte.com/",
  flipkart: "https://www.flipkartcareers.com/#!/joblist",
  freshworks: "https://www.freshworks.com/company/careers/jobs/",
  "goldman sachs": "https://www.goldmansachs.com/careers/students/programs/india/",
  google: "https://www.google.com/about/careers/applications/jobs/results/?location=India",
  ibm: "https://www.ibm.com/in-en/careers/search",
  infosys: "https://career.infosys.com/joblist",
  kpmg: "https://kpmg.com/in/en/home/careers.html",
  microsoft: "https://jobs.careers.microsoft.com/global/en/search?q=software&lc=India",
  "mu sigma": "https://www.mu-sigma.com/careers/",
  oracle: "https://careers.oracle.com/jobs/#en/sites/jobsearch/requisitions?location=India",
  tcs: "https://www.tcs.com/careers/india",
  wipro: "https://careers.wipro.com/careers-home/jobs",
  zoho: "https://www.zoho.com/careers/job-openings.html",
};

const cleanCompanyName = (name: string) => name.toLowerCase().trim();
const slugCompanyName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Live job board links per company (real-time access)
const liveBoards = (name: string) => [
  { label: `${name} Careers`, url: careerSites[cleanCompanyName(name)] || `https://www.linkedin.com/company/${slugCompanyName(name)}/jobs/` },
  { label: "LinkedIn Jobs", url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(name)}&location=India` },
  { label: "Naukri", url: `https://www.naukri.com/${slugCompanyName(name)}-jobs` },
  { label: "Glassdoor Interviews", url: `https://www.glassdoor.co.in/Interview/${encodeURIComponent(name)}-interview-questions.htm` },
];

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("companies").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setCompany(data as Company | null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <AppLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppLayout>;
  }

  if (!company) {
    return (
      <AppLayout>
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Company not found.</p>
          <Link to="/companies"><Button variant="outline" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const boards = liveBoards(company.name);

  const copyBoardLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: "Paste it in a browser tab if the job site blocks preview opening." });
    } catch {
      toast.info("Copy this link", { description: url });
    }
  };

  return (
    <AppLayout>
      <Link to="/companies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to companies
      </Link>

      {/* Hero */}
      <div className="mt-4 rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card sm:p-8 animate-fade-in-up">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card text-5xl shadow-card">{company.logo_emoji || "🏢"}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{company.name}</h1>
              <Badge variant="outline" className={diffColor[company.difficulty] || ""}>{company.difficulty}</Badge>
            </div>
            <p className="mt-2 max-w-3xl text-muted-foreground">{company.description || "Top recruiter from campus drives."}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" /><span className="font-semibold">{company.ctc || "Competitive CTC"}</span></div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" /> India · Hybrid / Remote</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><GraduationCap className="h-4 w-4" /> B.Tech / B.E / M.Tech</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Roles offered */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Roles & Job Offerings</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {company.roles.map((r) => (
              <div key={r} className="rounded-lg border border-border/60 bg-background p-4 transition-smooth hover:border-primary/40">
                <div className="font-semibold">{r}</div>
                <div className="mt-1 text-xs text-muted-foreground">Full-time · Fresher / Entry-level</div>
                <div className="mt-2 text-xs font-medium text-primary">{company.ctc || "Package varies"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills required */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Skills Required</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {company.topics.map((t) => (
              <Badge key={t} variant="outline" className="border-primary/30 bg-primary/5 text-primary">{t}</Badge>
            ))}
          </div>
          <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Soft skills</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Communication", "Problem solving", "Teamwork", "Ownership"].map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>

        {/* Selection pattern */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Selection Process</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{company.pattern || "Online assessment → Technical interviews → HR round."}</p>
          <ol className="mt-4 space-y-2 text-sm">
            {(company.pattern?.split(/→|->|,/).map(s => s.trim()).filter(Boolean) || ["Online Test", "Technical Interview", "HR Round"]).map((step, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Real-time access */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Live Openings</h2>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Open verified career pages and job boards in a new tab.</p>
          <div className="mt-3 flex flex-col gap-2">
            {boards.map((b) => (
              <div
                key={b.label}
                className="flex w-full items-center gap-2 rounded-lg border border-border/60 bg-background p-2 text-sm transition-smooth hover:border-primary/40 hover:bg-primary/5"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-md px-1 text-left"
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{b.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{new URL(b.url).hostname}</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary" />
                </a>
                <button
                  type="button"
                  onClick={() => copyBoardLink(b.url)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-smooth hover:border-primary/40 hover:text-primary"
                  aria-label={`Copy ${b.label} link`}
                  title="Copy link"
                >
                  <Clipboard className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            If a company site blocks opening inside preview, use the copy button and paste the link in a normal browser tab.
          </div>
          <div className="mt-4 rounded-lg border border-border/60 bg-background p-4">
            <div className="text-sm font-semibold">Typical fresher openings to search</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {company.roles.map((role) => (
                <Badge key={role} variant="secondary">{role}</Badge>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Search with: {company.name} + campus hiring, fresher, graduate engineer trainee, software engineer, associate consultant.
            </div>
          </div>
          <Link to="/prep-plan" className="mt-4 block">
            <Button className="w-full">Generate AI Prep Plan</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
