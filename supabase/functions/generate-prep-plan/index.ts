// Generates a personalized prep plan via Lovable AI
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { profile, scores, company, weeks } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are an expert placement coach. Build a ${weeks || 4}-week personalized preparation plan.

Student Profile:
- Name: ${profile?.full_name || "Student"}
- College: ${profile?.college || "N/A"}
- Branch: ${profile?.branch || "N/A"}, Year: ${profile?.year || "N/A"}

Skill Assessment (out of 10):
- Aptitude: ${scores?.aptitude_score ?? 0}
- Coding/DSA: ${scores?.coding_score ?? 0}
- Technical (CS Core): ${scores?.technical_score ?? 0}

Target Company: ${company?.name || "General"}
Company Topics: ${(company?.topics || []).join(", ")}
Difficulty: ${company?.difficulty || "Medium"}
Pattern: ${company?.pattern || "Standard"}

Output a markdown plan with:
1. Brief gap analysis (which weak areas to prioritize)
2. Week-by-week schedule (## Week 1, ## Week 2 ...) with daily focus, topics, resources, and one practice goal
3. Recommended platforms (LeetCode, GFG, etc.)
4. 3 mock-test milestones
5. Final tips for ${company?.name || "the interview"}

Be concise, actionable, and motivating. Use emoji headings.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are PrepGenie, an expert AI placement coach for Indian engineering students." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable workspace." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      console.error("AI error", r.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const plan = data.choices?.[0]?.message?.content || "Plan unavailable.";
    return new Response(JSON.stringify({ plan }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
