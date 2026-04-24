-- ResQNet Disaster Response System - Database Schema
-- Optimized for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLES CREATION
-- ==========================================

-- 👤 Citizens Table
CREATE TABLE IF NOT EXISTS public.citizens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 🛡️ Emergency Teams Table
CREATE TABLE IF NOT EXISTS public.emergency_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_user_id TEXT UNIQUE NOT NULL, -- e.g., RESQ-TEAM-XXXX
  full_name TEXT NOT NULL,
  batch_id TEXT UNIQUE NOT NULL,
  department TEXT CHECK (department IN ('police', 'fire', 'ambulance')) NOT NULL,
  rank TEXT NOT NULL,
  station_location TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 📊 Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_id UUID REFERENCES public.citizens(id) ON DELETE SET NULL,
  image_url TEXT,
  incident_type TEXT NOT NULL,
  description TEXT,
  contact_number TEXT,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('reported', 'assigned', 'in_progress', 'resolved')) DEFAULT 'reported',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 🚑 Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.emergency_teams(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('assigned', 'en_route', 'arrived', 'completed')) DEFAULT 'assigned',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 🔔 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Can refer to citizen or team member
  role TEXT CHECK (role IN ('citizen', 'team')) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- 2. AUTO-GENERATED ID LOGIC
-- ==========================================

-- Sequence for team ID numbers
CREATE SEQUENCE IF NOT EXISTS team_id_seq START 1000;

-- Function to generate RESQ-TEAM-XXXX format
CREATE OR REPLACE FUNCTION generate_team_id() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.generated_user_id IS NULL THEN
    NEW.generated_user_id := 'RESQ-TEAM-' || nextval('team_id_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to apply the ID before insertion
CREATE TRIGGER set_team_id
BEFORE INSERT ON public.emergency_teams
FOR EACH ROW
EXECUTE FUNCTION generate_team_id();

-- ==========================================
-- 3. INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON public.incidents(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_assignments_incident ON public.assignments(incident_id);
CREATE INDEX IF NOT EXISTS idx_assignments_team ON public.assignments(team_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- ==========================================
-- 4. REAL-TIME CONFIGURATION
-- ==========================================

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ==========================================
-- 5. SECURITY (RLS POLICIES)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- CITIZENS POLICIES
CREATE POLICY "Citizens can view their own profile" ON public.citizens
  FOR SELECT USING (auth.uid() = id);

-- INCIDENTS POLICIES
CREATE POLICY "Citizens can view their own reports" ON public.incidents
  FOR SELECT USING (auth.uid() = citizen_id);

CREATE POLICY "Citizens can insert their own reports" ON public.incidents
  FOR INSERT WITH CHECK (auth.uid() = citizen_id);

CREATE POLICY "Teams can view all incidents" ON public.incidents
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.emergency_teams WHERE id = auth.uid()));

-- ASSIGNMENTS POLICIES
CREATE POLICY "Teams can view their assignments" ON public.assignments
  FOR SELECT USING (team_id = auth.uid());

-- ==========================================
-- 6. SAMPLE INSERT QUERIES
-- ==========================================

-- Mock Batch IDs for initial verification
INSERT INTO public.emergency_teams (full_name, batch_id, department, rank, station_location, password_hash, is_verified)
VALUES 
  ('John Doe', 'BATCH-POL-7788', 'police', 'Sergeant', 'Downtown Precinct', 'hashed_pw_here', TRUE),
  ('Jane Smith', 'BATCH-FIRE-1122', 'fire', 'Captain', 'Station 5', 'hashed_pw_here', TRUE)
ON CONFLICT (batch_id) DO NOTHING;

-- Sample Incident (Requires a citizen ID, so usually done via app)
-- INSERT INTO public.incidents (citizen_id, incident_type, latitude, longitude, severity)
-- VALUES ('uuid-here', 'Fire', 40.7128, -74.0060, 'high');
