-- Dance Competition App - Initial Database Schema
-- This migration creates the core tables for users, videos, and leaderboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user profile information
-- Note: Authentication is handled by Supabase Auth (auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_username ON public.users(username);

-- ============================================
-- VIDEOS TABLE
-- ============================================
-- Stores video metadata and external URLs
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_videos_user_id ON public.videos(user_id);
CREATE INDEX idx_videos_created_at ON public.videos(created_at DESC);

-- ============================================
-- LEADERBOARD TABLE
-- ============================================
-- Stores competition entries with scores and rankings
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Add indexes for performance
CREATE INDEX idx_leaderboard_user_id ON public.leaderboard(user_id);
CREATE INDEX idx_leaderboard_video_id ON public.leaderboard(video_id);
CREATE INDEX idx_leaderboard_score ON public.leaderboard(score DESC);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard(rank);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
-- Allow users to read all user profiles
CREATE POLICY "Users can view all profiles"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- VIDEOS TABLE POLICIES
-- Allow all authenticated users to read videos
CREATE POLICY "Authenticated users can view all videos"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert videos
CREATE POLICY "Authenticated users can upload videos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to update their own videos
CREATE POLICY "Users can update their own videos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- LEADERBOARD TABLE POLICIES
-- Allow all authenticated users to read leaderboard
CREATE POLICY "Authenticated users can view leaderboard"
  ON public.leaderboard
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow system/admin to insert leaderboard entries
-- In production, you might want to restrict this further
CREATE POLICY "Authenticated users can insert leaderboard entries"
  ON public.leaderboard
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow system/admin to update leaderboard entries
CREATE POLICY "Authenticated users can update leaderboard entries"
  ON public.leaderboard
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on leaderboard changes
CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to recalculate ranks when scores change
CREATE OR REPLACE FUNCTION recalculate_leaderboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
  -- Update ranks based on score (highest score = rank 1)
  WITH ranked_entries AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY score DESC, created_at ASC) as new_rank
    FROM public.leaderboard
  )
  UPDATE public.leaderboard
  SET rank = ranked_entries.new_rank
  FROM ranked_entries
  WHERE public.leaderboard.id = ranked_entries.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate ranks after insert or update
CREATE TRIGGER recalculate_ranks_after_insert
  AFTER INSERT ON public.leaderboard
  FOR EACH STATEMENT
  EXECUTE FUNCTION recalculate_leaderboard_ranks();

CREATE TRIGGER recalculate_ranks_after_update
  AFTER UPDATE OF score ON public.leaderboard
  FOR EACH STATEMENT
  EXECUTE FUNCTION recalculate_leaderboard_ranks();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.users IS 'User profiles with basic information';
COMMENT ON TABLE public.videos IS 'Video metadata with external URLs for dance competition entries';
COMMENT ON TABLE public.leaderboard IS 'Competition leaderboard with scores and rankings';

COMMENT ON COLUMN public.videos.video_url IS 'External URL to video file (not stored in Supabase storage)';
COMMENT ON COLUMN public.leaderboard.rank IS 'Automatically calculated rank based on score';
