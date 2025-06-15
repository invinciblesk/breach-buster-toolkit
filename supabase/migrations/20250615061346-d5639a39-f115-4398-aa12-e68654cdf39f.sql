
-- Enable RLS and create policies for scan_campaigns table
ALTER TABLE public.scan_campaigns ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own scan campaigns
CREATE POLICY "Users can view their own scan campaigns" 
  ON public.scan_campaigns 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to create their own scan campaigns
CREATE POLICY "Users can create their own scan campaigns" 
  ON public.scan_campaigns 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own scan campaigns
CREATE POLICY "Users can update their own scan campaigns" 
  ON public.scan_campaigns 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own scan campaigns
CREATE POLICY "Users can delete their own scan campaigns" 
  ON public.scan_campaigns 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS and create policies for scans table
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view scans from their campaigns
CREATE POLICY "Users can view their own scans" 
  ON public.scans 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM scan_campaigns 
      WHERE scan_campaigns.id = scans.campaign_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Policy to allow users to create scans for their campaigns
CREATE POLICY "Users can create scans for their campaigns" 
  ON public.scans 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scan_campaigns 
      WHERE scan_campaigns.id = scans.campaign_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Policy to allow users to update their own scans
CREATE POLICY "Users can update their own scans" 
  ON public.scans 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM scan_campaigns 
      WHERE scan_campaigns.id = scans.campaign_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Enable RLS and create policies for vulnerabilities table
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view vulnerabilities from their scans
CREATE POLICY "Users can view their own vulnerabilities" 
  ON public.vulnerabilities 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM scans 
      JOIN scan_campaigns ON scans.campaign_id = scan_campaigns.id
      WHERE scans.id = vulnerabilities.scan_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Policy to allow creating vulnerabilities for user's scans
CREATE POLICY "Users can create vulnerabilities for their scans" 
  ON public.vulnerabilities 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans 
      JOIN scan_campaigns ON scans.campaign_id = scan_campaigns.id
      WHERE scans.id = vulnerabilities.scan_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Enable RLS and create policies for pii_findings table
ALTER TABLE public.pii_findings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view PII findings from their scans
CREATE POLICY "Users can view their own pii findings" 
  ON public.pii_findings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM scans 
      JOIN scan_campaigns ON scans.campaign_id = scan_campaigns.id
      WHERE scans.id = pii_findings.scan_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Policy to allow creating PII findings for user's scans
CREATE POLICY "Users can create pii findings for their scans" 
  ON public.pii_findings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans 
      JOIN scan_campaigns ON scans.campaign_id = scan_campaigns.id
      WHERE scans.id = pii_findings.scan_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

-- Enable RLS and create policies for security_reports table
ALTER TABLE public.security_reports ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own security reports
CREATE POLICY "Users can view their own security reports" 
  ON public.security_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to create their own security reports
CREATE POLICY "Users can create their own security reports" 
  ON public.security_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own security reports
CREATE POLICY "Users can update their own security reports" 
  ON public.security_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);
