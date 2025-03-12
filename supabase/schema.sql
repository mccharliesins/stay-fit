-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  age INTEGER,
  weight NUMERIC,
  height NUMERIC,
  goal TEXT,
  avatar_url TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add profile_image column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'profile_image'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN profile_image TEXT;
  END IF;
END $$;

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  calories INTEGER,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps INTEGER,
  weight NUMERIC,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can only view and update their own profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Workouts: Users can only CRUD their own workouts
CREATE POLICY "Users can view their own workouts" 
  ON public.workouts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts" 
  ON public.workouts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
  ON public.workouts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
  ON public.workouts FOR DELETE 
  USING (auth.uid() = user_id);

-- Exercises: Users can only CRUD exercises in their own workouts
CREATE POLICY "Users can view exercises in their workouts" 
  ON public.exercises FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));

CREATE POLICY "Users can insert exercises in their workouts" 
  ON public.exercises FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));

CREATE POLICY "Users can update exercises in their workouts" 
  ON public.exercises FOR UPDATE 
  USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));

CREATE POLICY "Users can delete exercises in their workouts" 
  ON public.exercises FOR DELETE 
  USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 