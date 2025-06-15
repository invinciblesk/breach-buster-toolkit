
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Missing authorization header')
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Authenticated user: ${user.id}`)

    const requestBody = await req.json()
    const { target, scanType, parameters } = requestBody

    // Validate input
    if (!target || !scanType) {
      return new Response(JSON.stringify({ error: 'Missing required fields: target and scanType' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Starting scan for user ${user.id} on target ${target} with type ${scanType}`)

    // First create a campaign for this scan with explicit user_id
    const { data: campaign, error: campaignError } = await supabase
      .from('scan_campaigns')
      .insert({
        user_id: user.id, // Explicitly set the user_id
        name: `Quick ${scanType.replace('_', ' ')} - ${target}`,
        description: `Automated scan campaign for ${target}`,
        target_scope: [target],
        scan_types: [scanType],
        status: 'running'
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Error creating campaign:', campaignError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create scan campaign',
        details: campaignError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Campaign created successfully:', campaign.id)

    // Create scan record with campaign association
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        campaign_id: campaign.id,
        scan_type: scanType,
        target: target,
        parameters: parameters || {},
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (scanError) {
      console.error('Error creating scan record:', scanError)
      // Clean up campaign if scan creation fails
      await supabase
        .from('scan_campaigns')
        .update({ status: 'failed' })
        .eq('id', campaign.id)
      
      return new Response(JSON.stringify({ 
        error: 'Failed to create scan record',
        details: scanError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Scan created successfully:', scan.id)

    // Simulate scan execution with more realistic results
    console.log(`Executing ${scanType} scan on ${target}`)
    
    // Simulate scan duration
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Generate more realistic scan results based on scan type
    let simulatedResults: any = {
      host: target,
      scan_time: new Date().toISOString(),
      scan_type: scanType
    }

    if (scanType === 'network_scan') {
      simulatedResults.ports = [
        { port: 22, state: 'open', service: 'ssh', version: 'OpenSSH 8.2' },
        { port: 80, state: 'open', service: 'http', version: 'Apache 2.4.41' },
        { port: 443, state: 'open', service: 'https', version: 'Apache 2.4.41' },
        { port: 3389, state: 'filtered', service: 'rdp' },
        { port: 21, state: 'closed', service: 'ftp' }
      ]
      simulatedResults.os_detection = 'Linux 4.15-5.4'
    } else if (scanType === 'vulnerability_scan') {
      simulatedResults.vulnerabilities_found = 3
      simulatedResults.critical_count = 1
      simulatedResults.high_count = 1
      simulatedResults.medium_count = 1
    } else if (scanType === 'pii_scan') {
      simulatedResults.files_scanned = 1247
      simulatedResults.pii_items_found = 2
      simulatedResults.sensitive_files = ['/var/log/auth.log', '/etc/passwd']
    }

    // Update scan with results
    const { error: updateError } = await supabase
      .from('scans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        raw_output: JSON.stringify(simulatedResults)
      })
      .eq('id', scan.id)

    if (updateError) {
      console.error('Error updating scan:', updateError)
    }

    // Update campaign status
    await supabase
      .from('scan_campaigns')
      .update({ status: 'completed' })
      .eq('id', campaign.id)

    // Create vulnerability records based on scan results
    const vulnerabilities = []
    
    if (scanType === 'network_scan' && simulatedResults.ports?.some((p: any) => p.port === 22 && p.state === 'open')) {
      vulnerabilities.push({
        scan_id: scan.id,
        title: 'SSH Service Exposed',
        description: 'SSH service is publicly accessible which may pose a security risk',
        severity: 'medium',
        affected_target: target,
        port: 22,
        service: 'ssh',
        evidence: { open_port: 22, service: 'ssh', version: 'OpenSSH 8.2' },
        remediation: 'Consider restricting SSH access to specific IP ranges or using key-based authentication'
      })
    }

    if (scanType === 'vulnerability_scan') {
      vulnerabilities.push({
        scan_id: scan.id,
        title: 'Outdated Software Version',
        description: 'The target system is running outdated software with known vulnerabilities',
        severity: 'high',
        affected_target: target,
        cve_id: 'CVE-2023-1234',
        cvss_score: 7.5,
        evidence: { software: 'Apache 2.4.41', vulnerability: 'Remote code execution' },
        remediation: 'Update to the latest version of Apache HTTP Server'
      })
    }

    if (vulnerabilities.length > 0) {
      const { error: vulnError } = await supabase.from('vulnerabilities').insert(vulnerabilities)
      if (vulnError) {
        console.error('Error inserting vulnerabilities:', vulnError)
      } else {
        console.log(`Created ${vulnerabilities.length} vulnerability records`)
      }
    }

    // Create PII findings for PII scans
    if (scanType === 'pii_scan') {
      const piiFindings = [
        {
          scan_id: scan.id,
          file_path: '/var/log/auth.log',
          pii_type: 'email',
          confidence_score: 0.95,
          context_snippet: 'user@example.com authenticated successfully',
          is_encrypted: false,
          risk_level: 'medium'
        }
      ]

      const { error: piiError } = await supabase.from('pii_findings').insert(piiFindings)
      if (piiError) {
        console.error('Error inserting PII findings:', piiError)
      } else {
        console.log(`Created ${piiFindings.length} PII finding records`)
      }
    }

    console.log('Scan completed successfully')

    return new Response(JSON.stringify({ 
      scan_id: scan.id,
      campaign_id: campaign.id,
      status: 'completed',
      results: simulatedResults,
      vulnerabilities_created: vulnerabilities.length,
      message: `${scanType.replace('_', ' ')} completed successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in nmap-scanner:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
