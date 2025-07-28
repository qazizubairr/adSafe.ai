-- AdSafe.ai Database Setup
-- Run these commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  scan_count INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  file_url TEXT NOT NULL,
  ocr_text TEXT,
  gpt_feedback TEXT NOT NULL,
  violation BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for scans table
CREATE POLICY "Users can view own scans" ON scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scans" ON scans
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create storage bucket for uploads
-- Note: This needs to be done through the Supabase dashboard
-- Go to Storage > Create a new bucket named 'uploads'
-- Set it to public access for file uploads 