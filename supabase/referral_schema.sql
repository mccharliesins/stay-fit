-- Drop redundant tables if they exist
DROP TABLE IF EXISTS public.invite_codes CASCADE;
DROP TABLE IF EXISTS public.invite_code_uses CASCADE;
DROP TABLE IF EXISTS public.referral_rewards CASCADE;
DROP TRIGGER IF EXISTS process_referral_reward_trigger ON public.subscriptions;
DROP FUNCTION IF EXISTS public.process_referral_reward();
DROP FUNCTION IF EXISTS public.create_referral_code();
DROP FUNCTION IF EXISTS public.use_invite_code();

-- Ensure profiles has referral columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_referral_earnings DECIMAL(10,2) DEFAULT 0.00;

-- Create referral_earnings table (single source of truth for referral tracking)
CREATE TABLE IF NOT EXISTS public.referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id),
  referred_user_id UUID REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.referral_earnings ENABLE ROW LEVEL SECURITY;

-- Policies for referral_earnings
CREATE POLICY "Users can view their own referral earnings"
  ON public.referral_earnings FOR SELECT
  USING (auth.uid() = referrer_id);

-- Function to generate random referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$;

-- Function to create referral code for new user
CREATE OR REPLACE FUNCTION public.create_user_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Generate a unique referral code
  LOOP
    new_code := public.generate_referral_code();
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE referral_code = new_code
    );
  END LOOP;

  -- Set the referral code
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$;

-- Trigger to automatically create referral code for new users
CREATE TRIGGER create_referral_code_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_referral_code();

-- Function to validate and use referral code
CREATE OR REPLACE FUNCTION public.use_referral_code(code_to_use TEXT, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referrer_id UUID;
BEGIN
  -- Find the referrer
  SELECT id INTO referrer_id
  FROM public.profiles
  WHERE referral_code = code_to_use;

  -- Check if code exists
  IF referrer_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user is trying to use their own code
  IF referrer_id = user_id THEN
    RETURN false;
  END IF;

  -- Check if user has already been referred
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND referred_by IS NOT NULL) THEN
    RETURN false;
  END IF;

  -- Update the referred user's profile
  UPDATE public.profiles
  SET referred_by = referrer_id
  WHERE id = user_id;

  -- Increment referrer's total_referrals
  UPDATE public.profiles
  SET total_referrals = total_referrals + 1
  WHERE id = referrer_id;

  RETURN true;
END;
$$;

-- Function to process referral earnings when subscription is purchased
CREATE OR REPLACE FUNCTION public.process_referral_earnings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referrer_id UUID;
  commission_amount DECIMAL(10,2);
BEGIN
  -- Get referrer ID from the subscriber's profile
  SELECT referred_by INTO referrer_id
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- If user was referred, calculate and record commission
  IF referrer_id IS NOT NULL THEN
    -- Calculate commission
    commission_amount := CASE
      WHEN NEW.plan_type = 'monthly' THEN 5.00  -- $5 commission for monthly
      WHEN NEW.plan_type = 'annual' THEN 15.00  -- $15 commission for annual
      ELSE 0.00
    END;

    -- Record the earning
    INSERT INTO public.referral_earnings (
      referrer_id,
      referred_user_id,
      subscription_id,
      amount,
      status
    ) VALUES (
      referrer_id,
      NEW.user_id,
      NEW.id,
      commission_amount,
      'approved'
    );

    -- Update referrer's total earnings
    UPDATE public.profiles
    SET total_referral_earnings = total_referral_earnings + commission_amount
    WHERE id = referrer_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for processing referral earnings
CREATE TRIGGER process_referral_earnings_trigger
  AFTER INSERT ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_earnings(); 