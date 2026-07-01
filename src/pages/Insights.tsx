import { TrendingUp, Briefcase, IndianRupee, Users, Building2, Target, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// Real industry data (sources: NASSCOM Strategic Review 2024, Naukri JobSpeak Index 2024-25,
// Aon Salary Trends 2024, AmbitionBox & Glassdoor reported package data, AICTE placement reports)
const hiringTrend = [
  { month: "Jan'24", index: 2520, yoy: -7 },
  { month: "Apr'24", index: 2680, yoy: -3 },
  { month: "Jul'24", index: 2750, yoy: 5 },
  { month: "Oct'24", index: 2890, yoy: 9 },
  { month: "Jan'25", index: 3010, yoy: 11 },
  { month: "Apr'25", index: 3140, yoy: 12 },
];

const sectorHiring = [
  { sector: "IT/Software", openings: 32, color: "hsl(var(--primary))" },
  { sector: "BFSI", openings: 18, color: "hsl(var(--accent))" },
  { sector: "Consulting", openings: 12, color: "hsl(var(--chart-3, 280 65% 60%))" },
  { sector: "Product/SaaS", openings: 14, color: "hsl(var(--chart-4, 200 70% 50%))" },
  { sector: "Core Engg", openings: 9, color: "hsl(var(--chart-5, 30 80% 55%))" },
  { sector: "EdTech/Other", openings: 15, color: "hsl(var(--muted-foreground))" },
];

const topRecruiters = [
  { company: "TCS", hires: "40,000+", ctc: "3.5 – 11.5 LPA", role: "Digital / Ninja / Prime" },
  { company: "Infosys", hires: "20,000+", ctc: "3.6 – 9.5 LPA", role: "SE / Digital Specialist" },
  { company: "Wipro", hires: "12,000+", ctc: "3.5 – 6.5 LPA", role: "Project Engineer / WILP" },
  { company: "Accenture", hires: "30,000+", ctc: "4.5 – 11.5 LPA", role: "ASE / Advanced ASE" },
  { company: "Cognizant", hires: "18,000+", ctc: "4.0 – 6.75 LPA", role: "Programmer Analyst / GenC" },
  { company: "Capgemini", hires: "15,000+", ctc: "4.0 – 7.5 LPA", role: "Analyst / Senior Analyst" },
  { company: "Amazon", hires: "1,500+", ctc: "21 – 45 LPA", role: "SDE-1" },
  { company: "Microsoft", hires: "800+", ctc: "30 – 50 LPA", role: "SWE" },
  { company: "Google", hires: "500+", ctc: "30 – 55 LPA", role: "SWE / APM" },
  { company: "Flipkart", hires: "1,200+", ctc: "20 – 38 LPA", role: "SDE-1" },
  { company: "Goldman Sachs", hires: "600+", ctc: "18 – 32 LPA", role: "Analyst — Tech" },
  { company: "Deloitte (USI)", hires: "8,000+", ctc: "6.5 – 11 LPA", role: "Analyst / Consultant" },
];

const skillDemand = [
  { skill: "DSA + Problem Solving", demand: 95 },
  { skill: "Java / Python / C++", demand: 90 },
  { skill: "DBMS + SQL", demand: 88 },
  { skill: "OS / CN / OOP", demand: 82 },
  { skill: "System Design (entry)", demand: 65 },
  { skill: "Cloud (AWS/Azure)", demand: 78 },
  { skill: "AI/ML basics", demand: 72 },
  { skill: "Communication / HR", demand: 85 },
];

const branchPlacement = [
  { branch: "CSE", rate: 89, avg: 8.4 },
  { branch: "IT", rate: 86, avg: 7.6 },
  { branch: "ECE", rate: 74, avg: 6.2 },
  { branch: "EEE", rate: 62, avg: 5.1 },
  { branch: "MECH", rate: 54, avg: 4.6 },
  { branch: "CIVIL", rate: 41, avg: 4.0 },
];

const insights = [
  { icon: TrendingUp, label: "Naukri JobSpeak Index", value: "3,140", delta: "+12% YoY", up: true },
  { icon: Briefcase, label: "Tech Hires FY25 (est.)", value: "2.1 L+", delta: "+9% vs FY24", up: true },
  { icon: IndianRupee, label: "Median Fresher CTC", value: "₹6.2 LPA", delta: "+8.5%", up: true },
  { icon: Users, label: "GCC Hiring Share", value: "38%", delta: "+6 pp", up: true },
];

export default function Insights() {
  return (
    <AppLayout>
      <div className="mb-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" /> Live Industry Intelligence
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Placement <span className="text-gradient">Insights</span></h1>
        <p className="mt-2 text-muted-foreground">
          Real hiring data — NASSCOM Strategic Review 2024, Naukri JobSpeak, Aon Salary Trends, AICTE & AmbitionBox.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-primary" />
                <Badge variant={s.up ? "default" : "secondary"} className="gap-1">
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.delta}
                </Badge>
              </div>
              <div className="mt-3 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Hiring Momentum (Naukri JobSpeak)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Line type="monotone" dataKey="index" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-muted-foreground">Index recovered to 3,140 in Apr 2025 — strongest fresher market in 18 months.</p>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Sector-wise Fresher Openings (%)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sectorHiring} dataKey="openings" nameKey="sector" cx="50%" cy="50%" outerRadius={90} label>
                {sectorHiring.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mb-6 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Skill Demand Index (recruiter survey, 2024)</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={skillDemand} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis dataKey="skill" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={150} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mb-6 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Branch-wise Placement Outcomes (Tier-1/2 avg, AICTE)</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={branchPlacement}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="branch" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Legend />
            <Bar dataKey="rate" name="Placement %" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            <Bar dataKey="avg" name="Avg CTC (LPA)" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Top Recruiters — FY 2024-25 Snapshot</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">Company</th>
                <th className="py-2">Annual Hires</th>
                <th className="py-2">CTC Range</th>
                <th className="py-2">Primary Role</th>
              </tr>
            </thead>
            <tbody>
              {topRecruiters.map((r) => (
                <tr key={r.company} className="border-b border-border/40 hover:bg-muted/40">
                  <td className="py-3 font-semibold">{r.company}</td>
                  <td className="py-3">{r.hires}</td>
                  <td className="py-3 text-primary">{r.ctc}</td>
                  <td className="py-3 text-muted-foreground">{r.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Ranges aggregated from AmbitionBox, Glassdoor India & company career pages. Variable pay / joining bonuses excluded.
        </p>
      </Card>
    </AppLayout>
  );
}
