import { useEffect, useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    college: "",
    branch: "",
    year: "",
    target_companies: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setForm({
          full_name: data.full_name || "",
          college: data.college || "",
          branch: data.branch || "",
          year: data.year || "",
          target_companies: (data.target_companies || []).join(", "),
        });
      }
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      college: form.college,
      branch: form.branch,
      year: form.year,
      target_companies: form.target_companies.split(",").map((t) => t.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  return (
    <AppLayout>
      <div className="mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <User className="h-3 w-3" /> Student Profile
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Your <span className="text-gradient">profile</span></h1>
        <p className="mt-2 text-muted-foreground">Helps the AI tailor recommendations to you.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Aarav Sharma" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>College</Label>
            <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="IIT Bombay" />
          </div>
          <div className="space-y-2">
            <Label>Branch</Label>
            <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="Computer Science" />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={form.year} onValueChange={(v) => setForm({ ...form, year: v })}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {["1st", "2nd", "3rd", "4th", "Final"].map((y) => <SelectItem key={y} value={y}>{y} Year</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Target companies (comma-separated)</Label>
            <Input value={form.target_companies} onChange={(e) => setForm({ ...form, target_companies: e.target.value })} placeholder="Google, Microsoft, TCS" />
          </div>
        </div>
        <Button onClick={save} disabled={loading} className="mt-6 bg-gradient-hero shadow-elegant">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Profile
        </Button>
      </div>
    </AppLayout>
  );
}
