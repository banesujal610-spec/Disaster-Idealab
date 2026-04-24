-- ==========================================
-- FIX: Add missing RLS policies for backend operations
-- Run this in Supabase Dashboard → SQL Editor
-- ==========================================

-- CITIZENS TABLE: Allow signup (INSERT) and login lookup (SELECT)
CREATE POLICY "Allow citizen signup" ON public.citizens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow citizen login lookup" ON public.citizens
  FOR SELECT USING (true);

-- TEAMS TABLE: Allow signup and login
CREATE POLICY "Allow team signup" ON public.emergency_teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow team login lookup" ON public.emergency_teams
  FOR SELECT USING (true);

-- INCIDENTS TABLE: Allow creating and reading incidents
CREATE POLICY "Allow creating incidents" ON public.incidents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow reading all incidents" ON public.incidents
  FOR SELECT USING (true);

CREATE POLICY "Allow updating incidents" ON public.incidents
  FOR UPDATE USING (true);

-- ASSIGNMENTS TABLE: Allow full access for backend
CREATE POLICY "Allow creating assignments" ON public.assignments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow reading assignments" ON public.assignments
  FOR SELECT USING (true);

CREATE POLICY "Allow updating assignments" ON public.assignments
  FOR UPDATE USING (true);

-- NOTIFICATIONS TABLE: Allow full access
CREATE POLICY "Allow creating notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow reading notifications" ON public.notifications
  FOR SELECT USING (true);

-- BATCH RECORDS TABLE (if it exists and has RLS)
-- Allow reading batch records for team verification
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'batch_records') THEN
    EXECUTE 'ALTER TABLE public.batch_records ENABLE ROW LEVEL SECURITY';
    EXECUTE 'CREATE POLICY "Allow reading batch records" ON public.batch_records FOR SELECT USING (true)';
  END IF;
END $$;
