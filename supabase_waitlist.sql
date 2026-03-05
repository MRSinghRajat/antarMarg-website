-- ============================================
-- ANTAR MARG WAITLIST TABLE
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- User info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  device_type TEXT,

  -- Who is this app for? (can select multiple)
  usage_for TEXT[] NOT NULL DEFAULT '{}',
  -- Possible values:
  --   'self'              → Personal spiritual growth
  --   'spouse'            → For spouse / partner
  --   'expecting_mother'  → Garbh Sanskar journey (pregnancy)
  --   'children'          → Little Sadhu (kids program)
  --   'parents_elders'    → For parents / elders (Vanaprastha)
  --   'student'           → Student learning scriptures
  --   'family'            → Whole family use

  -- Which features are they most interested in?
  interests TEXT[] DEFAULT '{}',
  -- Possible values:
  --   'sacred_texts'      → Bhagavad Gita, Ramayana, etc.
  --   'daily_practice'    → Daily verse, streaks, mantras
  --   'ai_guru'           → AI spiritual guidance
  --   'journeys'          → Spiritual journeys & sadhanas
  --   'stories'           → Sacred stories & wisdom
  --   'audio'             → Mantras, bhajans, meditation audio
  --   'ashram'            → Virtual ashram / gamification
  --   'kundli'            → Kundli, numerology, palmistry
  --   'meditation'        → Meditation & mindfulness

  -- Optional: how they heard about us
  referral_source TEXT,

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'joined')),
  invited_at TIMESTAMPTZ,
  notes TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_waitlist_email ON waitlist (email);
CREATE INDEX idx_waitlist_created_at ON waitlist (created_at DESC);
CREATE INDEX idx_waitlist_status ON waitlist (status);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the website form)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admins) can read/update/delete
CREATE POLICY "Admins can read all" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update" ON waitlist
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add a comment to the table
COMMENT ON TABLE waitlist IS 'Grannthalya app waitlist signups from the landing page';
