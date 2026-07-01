// AI Resume Reviewer — general review OR resume-vs-JD gap analysis
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { resume_text, target_role, jd_text, mode } = await req.json();
    if (!resume_text || resume_text.length < 50) {
      return new Response(JSON.stringify({ error: "Paste at least a few lines of resume text" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const isJd = mode === "jd" && jd_text && jd_text.length > 20;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = isJd
      ? `Compare this resume to the job description for role: ${target_role || "Software Engineer"}.

Return MARKDOWN with these EXACT sections:

## 🎯 Match Score
Overall match X/100 with a one-line verdict.

## ✅ Matched Skills & Keywords
JD requirements the resume CLEARLY satisfies. One bullet each, quote resume evidence.

## ❌ Missing from Resume (Required by JD)
JD requirements NOT found in resume. Be specific: skill name + why it matters.

## ⚠️ Weakly Covered
JD requirements mentioned but not strongly demonstrated.

## 📚 Skill Improvement Roadmap (JD-Driven)
For EACH missing or weak skill from the JD, give a mini-plan in this exact format:
### <Skill Name> — Priority: High/Medium/Low
- **Why JD needs it:** one line from the JD context
- **Current gap:** what's missing in the resume
- **Learn in 1-2 weeks:** 2-3 concrete resources (free courses/docs/YouTube channels with names, e.g. "freeCodeCamp REST API course", "Docker official getting-started")
- **Build to prove it:** one small project idea (1-3 days) that would create a resume bullet
- **Resume bullet to add after:** a ready-to-paste bullet with a metric placeholder

## ✏️ Suggested Resume Edits
Concrete rewrites for existing bullets. Show before → after.

## 🚀 24-Hour Quick Wins
Top 3 things to do TODAY to raise the match score immediately (keyword tweaks, reorder, add a line).

---
JOB DESCRIPTION:
"""${jd_text.slice(0, 6000)}"""

RESUME:
"""${resume_text.slice(0, 8000)}"""`
      : `Review this resume for the role: ${target_role || "Software Engineer fresher"}.

Return MARKDOWN with these EXACT sections:
## 🎯 Overall Score
Score X/100 with one-line verdict.

## 📊 Section Scores
- **Impact & Quantification**: X/10 — short reason
- **Technical Depth**: X/10
- **Project Quality**: X/10
- **Skills Relevance**: X/10
- **Formatting & ATS**: X/10
- **Clarity & Brevity**: X/10

## ✅ What's Working
3-5 bullets

## ❌ Critical Issues
3-5 bullets, be specific

## ✏️ Rewrite Examples
Pick 2 weak bullets and show before → after.

## 🚀 Action Plan
3 prioritized fixes for the next 24 hours.

Resume:
"""${resume_text.slice(0, 8000)}"""`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert tech recruiter reviewing placement resumes for Indian engineering students. Be precise and actionable." },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      console.error("AI error", r.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const review = data.choices?.[0]?.message?.content || "Review unavailable.";
    return new Response(JSON.stringify({ review }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
