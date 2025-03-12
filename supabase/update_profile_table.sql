-- Add profile_image column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'profile_image'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN profile_image TEXT;
    RAISE NOTICE 'Added profile_image column to profiles table';
  ELSE
    RAISE NOTICE 'profile_image column already exists in profiles table';
  END IF;
END $$; 