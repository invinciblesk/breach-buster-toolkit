
-- Create enum types for various security tool categories and statuses
CREATE TYPE scan_type AS ENUM (
  'network_scan',
  'vulnerability_scan', 
  'filesystem_scan',
  'pii_scan',
  'compliance_scan'
);

CREATE TYPE scan_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE severity_level AS ENUM (
  'critical',
  'high',
  'medium',
  'low',
  'info'
);

CREATE TYPE integration_type AS ENUM (
  'siem',
  'soar',
  'splunk',
  'firewall',
  'nmap',
  'metasploit',
  'openvas'
);

-- Create security tools configuration table
CREATE TABLE security_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type integration_type NOT NULL,
  endpoint_url TEXT,
  api_key_encrypted TEXT,
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scan campaigns table for organizing security assessments
CREATE TABLE scan_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_scope TEXT[] NOT NULL, -- IP ranges, domains, etc.
  scan_types scan_type[] NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status scan_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create individual scans table
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES scan_campaigns(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES security_tools(id),
  scan_type scan_type NOT NULL,
  target TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  status scan_status DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  raw_output TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vulnerabilities table for storing discovered security issues
CREATE TABLE vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  cve_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  severity severity_level NOT NULL,
  cvss_score DECIMAL(3,1),
  affected_target TEXT NOT NULL,
  port INTEGER,
  service TEXT,
  evidence JSONB DEFAULT '{}',
  remediation TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create PII findings table for sensitive data discovery
CREATE TABLE pii_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  pii_type TEXT NOT NULL, -- SSN, credit card, email, etc.
  confidence_score DECIMAL(3,2),
  context_snippet TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  risk_level severity_level NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SIEM/SOAR integration logs
CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES security_tools(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response JSONB,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reports table for generating assessment reports
CREATE TABLE security_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES scan_campaigns(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  executive_summary TEXT,
  findings_summary JSONB DEFAULT '{}',
  report_data JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scan_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pii_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user data isolation
CREATE POLICY "Users can manage their own campaigns" ON scan_campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access scans from their campaigns" ON scans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scan_campaigns 
      WHERE scan_campaigns.id = scans.campaign_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access vulnerabilities from their scans" ON vulnerabilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scans 
      JOIN scan_campaigns ON scan_campaigns.id = scans.campaign_id
      WHERE scans.id = vulnerabilities.scan_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access PII findings from their scans" ON pii_findings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scans 
      JOIN scan_campaigns ON scan_campaigns.id = scans.campaign_id
      WHERE scans.id = pii_findings.scan_id 
      AND scan_campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own reports" ON security_reports
  FOR ALL USING (auth.uid() = user_id);

-- Admin-only policies for security tools and integration logs
CREATE POLICY "Admins can manage security tools" ON security_tools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can view integration logs" ON integration_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert some default security tools configurations
INSERT INTO security_tools (name, type, configuration) VALUES
  ('Nmap Network Scanner', 'nmap', '{"default_args": ["-sS", "-O", "-sV"], "timeout": 300}'),
  ('OpenVAS Vulnerability Scanner', 'openvas', '{"scan_config": "full_and_fast", "max_hosts": 50}'),
  ('Metasploit Framework', 'metasploit', '{"workspace": "default", "auto_exploit": false}'),
  ('Splunk SIEM', 'splunk', '{"index": "security", "sourcetype": "cyberpen"}'),
  ('Generic SOAR Platform', 'soar', '{"playbook_triggers": ["high_severity_vuln", "pii_exposure"]}');
