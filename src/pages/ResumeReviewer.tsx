import { useRef, useState } from "react";
import { FileText, Sparkles, Loader2, Target, Upload, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractPdfText } from "@/lib/pdf";

const SAMPLE_RESUME = `John Doe
B.Tech Computer Science · IIT Bombay · CGPA 8.4
Email: john@example.com · GitHub: /johndoe

PROJECTS
- Built a chat app using React and Firebase.
- Worked on a machine learning model for spam detection.

SKILLS
C++, Python, React, SQL, Git

EXPERIENCE
- Intern at XYZ — worked on backend tasks for 2 months.`;

const SAMPLE_JD = `Software Engineer - Backend (Fresher)
Requirements:
- Strong knowledge of Java or Python
- Experience with REST APIs, Spring Boot / Django
- Familiarity with AWS, Docker, Kubernetes
- SQL & NoSQL databases (PostgreSQL, MongoDB)
- System design fundamentals
- CI/CD pipelines, Git
- Good communication & teamwork`;

export default function ResumeReviewer() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string>("");
  const [mode, setMode] = useState<"review" | "jd">("jd");
  const [resumeFile, setResumeFile] = useState<string>("");
  const [jdFile, setJdFile] = useState<string>("");
  const [parsing, setParsing] = useState<"resume" | "jd" | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  const handlePdf = async (file: File | undefined, target: "resume" | "jd") => {
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("PDF must be under 8MB"); return; }
    setParsing(target);
    try {
      const text = await extractPdfText(file);
      if (!text || text.length < 30) { toast.error("Couldn't read text from this PDF (it may be scanned/image-only)"); return; }
      if (target === "resume") { setResume(text); setResumeFile(file.name); }
      else { setJd(text); setJdFile(file.name); }
      toast.success(`${target === "resume" ? "Resume" : "JD"} loaded from ${file.name}`);
    } catch (e: any) {
      toast.error("Failed to parse PDF: " + (e.message || "unknown"));
    } finally { setParsing(null); }
  };

  const analyze = async () => {
    if (resume.trim().length < 50) { toast.error("Upload a resume PDF or paste at least a few lines"); return; }
    if (mode === "jd" && jd.trim().length < 30) { toast.error("Upload the JD PDF or paste the job description"); return; }
    setLoading(true);
    setReview("");
    try {
      const { data, error } = await supabase.functions.invoke("review-resume", {
        body: { resume_text: resume, target_role: role, jd_text: mode === "jd" ? jd : undefined, mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReview(data.review);
      toast.success(mode === "jd" ? "Comparison ready!" : "Review ready!");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="mb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <FileText className="h-3 w-3" /> AI Resume Reviewer
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">
          Resume vs <span className="text-gradient">Job Description</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Upload your resume PDF and the company JD PDF — get a side-by-side comparison and exactly what to improve.</p>
      </div>

      <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setMode("jd")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${mode === "jd" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Target className="mr-1 inline h-3 w-3" /> Compare with JD
        </button>
        <button
          onClick={() => setMode("review")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${mode === "review" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          General Review
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="space-y-2">
            <Label>Target Role</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="SDE-1, Data Analyst, etc." />
          </div>

          {/* Resume */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Your Resume</Label>
              <div className="flex gap-3 text-xs">
                <button className="text-primary hover:underline" onClick={() => { setResume(SAMPLE_RESUME); setResumeFile(""); }}>Use sample</button>
              </div>
            </div>
            <input ref={resumeInputRef} type="file" accept="application/pdf" hidden onChange={(e) => handlePdf(e.target.files?.[0], "resume")} />
            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => resumeInputRef.current?.click()} disabled={parsing === "resume"}>
              {parsing === "resume" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {resumeFile ? `Replace PDF (${resumeFile})` : "Upload Resume PDF"}
            </Button>
            {!resumeFile && (
              <>
                <Textarea
                  value={resume}
                  onChange={(e) => { setResume(e.target.value); setResumeFile(""); }}
                  placeholder="…or paste your resume text here"
                  className="min-h-[160px] resize-none font-mono text-xs"
                  maxLength={15000}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{resume.length}/15000</span>
                </div>
              </>
            )}
            {resumeFile && (
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
                <span className="inline-flex items-center gap-2 truncate"><FileText className="h-3 w-3 text-primary" /> {resumeFile} <span className="text-muted-foreground">· {resume.length} chars extracted</span></span>
                <button onClick={() => { setResume(""); setResumeFile(""); }} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
              </div>
            )}
          </div>

          {/* JD */}
          {mode === "jd" && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Company Job Description</Label>
                <button className="text-xs text-primary hover:underline" onClick={() => { setJd(SAMPLE_JD); setJdFile(""); }}>Use sample</button>
              </div>
              <input ref={jdInputRef} type="file" accept="application/pdf" hidden onChange={(e) => handlePdf(e.target.files?.[0], "jd")} />
              <Button type="button" variant="outline" className="w-full justify-start" onClick={() => jdInputRef.current?.click()} disabled={parsing === "jd"}>
                {parsing === "jd" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {jdFile ? `Replace PDF (${jdFile})` : "Upload JD PDF"}
              </Button>
              {!jdFile && (
                <>
                  <Textarea
                    value={jd}
                    onChange={(e) => { setJd(e.target.value); setJdFile(""); }}
                    placeholder="…or paste the job description here"
                    className="min-h-[140px] resize-none font-mono text-xs"
                    maxLength={10000}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{jd.length}/10000</span>
                  </div>
                </>
              )}
              {jdFile && (
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
                  <span className="inline-flex items-center gap-2 truncate"><FileText className="h-3 w-3 text-primary" /> {jdFile} <span className="text-muted-foreground">· {jd.length} chars extracted</span></span>
                  <button onClick={() => { setJd(""); setJdFile(""); }} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>
          )}

          <Button onClick={analyze} disabled={loading} className="mt-4 w-full bg-gradient-hero shadow-elegant">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> {mode === "jd" ? "Compare & Suggest Improvements" : "Analyze Resume"}</>}
          </Button>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          {!review && !loading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">
                {mode === "jd" ? "Comparison report appears here" : "Your review appears here"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "jd" ? "Match score · matched vs missing skills · what to add to your resume · 24h fix plan" : "Scores · critical issues · rewrites · 24h action plan"}
              </p>
            </div>
          )}
          {loading && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">AI is comparing your resume against the JD...</p>
            </div>
          )}
          {review && (
            <div className="prose prose-sm max-w-none prose-headings:font-display">
              <ReactMarkdown>{review}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
