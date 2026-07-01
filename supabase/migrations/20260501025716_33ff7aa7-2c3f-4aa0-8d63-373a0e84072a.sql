
CREATE TABLE public.progress_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  readiness_score integer NOT NULL,
  placement_probability numeric NOT NULL,
  aptitude_score integer NOT NULL,
  coding_score integer NOT NULL,
  technical_score integer NOT NULL,
  communication_score integer NOT NULL,
  weak_areas text[] NOT NULL DEFAULT '{}',
  recommended_companies text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own snapshot select" ON public.progress_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own snapshot insert" ON public.progress_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own snapshot delete" ON public.progress_snapshots
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX progress_snapshots_user_created ON public.progress_snapshots(user_id, created_at DESC);
