
-- Make user_id column NOT NULL in scan_campaigns table since RLS depends on it
ALTER TABLE public.scan_campaigns 
ALTER COLUMN user_id SET NOT NULL;

-- Also make user_id NOT NULL in security_reports table for consistency
ALTER TABLE public.security_reports 
ALTER COLUMN user_id SET NOT NULL;
