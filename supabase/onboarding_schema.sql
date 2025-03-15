-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  used_by UUID REFERENCES auth.users(id),
  is_valid BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'pending',
  invite_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  fitness_goal TEXT,
  activity_level TEXT,
  workout_preferences TEXT[],
  reminder_time TIME,
  reminder_days TEXT[],
  privacy_settings JSONB DEFAULT '{"profile": "private", "workouts": "private", "progress": "private"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS invite_code TEXT REFERENCES invite_codes(code),
  ADD COLUMN IF NOT EXISTS fitness_level TEXT,
  ADD COLUMN IF NOT EXISTS preferred_workout_time TIME,
  ADD COLUMN IF NOT EXISTS preferred_workout_days TEXT[];

-- Enable Row Level Security
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for invite_codes
CREATE POLICY "Anyone can view valid invite codes" 
  ON public.invite_codes FOR SELECT 
  USING (is_valid = true AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP));

CREATE POLICY "Users can create invite codes" 
  ON public.invite_codes FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

-- Create policies for waitlist
CREATE POLICY "Anyone can join waitlist" 
  ON public.waitlist FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist status" 
  ON public.waitlist FOR SELECT 
  USING (email = auth.jwt() ->> 'email');

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own preferences" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subscriptions" 
  ON public.subscriptions FOR ALL 
  USING (auth.uid() = user_id);

-- Create function to validate invite code
CREATE OR REPLACE FUNCTION public.validate_invite_code(code_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.invite_codes
    WHERE code = code_to_check
    AND is_valid = true
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  );
END;
$$;

-- Create function to use invite code
CREATE OR REPLACE FUNCTION public.use_invite_code(code_to_use TEXT, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.invite_codes
  SET used_by = user_id,
      used_at = CURRENT_TIMESTAMP,
      is_valid = false
  WHERE code = code_to_use
  AND is_valid = true
  AND used_by IS NULL
  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP);
  
  RETURN FOUND;
END;
$$; 