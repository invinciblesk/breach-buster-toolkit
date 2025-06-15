
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

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { target, scanType, parameters } = await req.json()

    console.log(`Starting scan for user ${user.id} on target ${target}`)

    // First create a campaign for this scan
    const { data: campaign, error: campaignError } = await supabase
      .from('scan_campaigns')
      .insert({
        user_id: user.id,
        name: `Quick ${scanType} - ${target}`,
        description: `Automated scan campaign for ${target}`,
        target_scope: [target],
        scan_types: [scanType],
        status: 'running'
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Error creating campaign:', campaignError)
      return new Response(JSON.stringify({ error: 'Failed to create scan campaign' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Campaign created:', campaign.id)

    // Create scan record with campaign association
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        campaign_id: campaign.id,
        scan_type: scanType,
        target: target,
        parameters: parameters,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (scanError) {
      console.error('Error creating scan record:', scanError)
      return new Response(JSON.stringify({ error: 'Failed to create scan record' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Scan created:', scan.id)

    // Simulate Nmap scan execution
    console.log(`Starting Nmap scan on ${target} with type ${scanType}`)
    
    // In a real implementation, you would execute actual Nmap commands here
    // For demo purposes, we'll simulate scan results
    const simulatedResults = {
      host: target,
      ports: [
        { port: 22, state: 'open', service: 'ssh' },
        { port: 80, state: 'open', service: 'http' },
        { port: 443, state: 'open', service: 'https' },
        { port: 3389, state: 'filtered', service: 'rdp' }
      ],
      os_detection: 'Linux 4.15',
      scan_time: new Date().toISOString()
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
    if (simulatedResults.ports.some(p => p.port === 22 && p.state === 'open')) {
      vulnerabilities.push({
        scan_id: scan.id,
        title: 'SSH Service Exposed',
        description: 'SSH service is publicly accessible',
        severity: 'medium',
        affected_target: target,
        port: 22,
        service: 'ssh',
        evidence: { open_port: 22, service: 'ssh' },
        remediation: 'Consider restricting SSH access or using key-based authentication'
      })
    }

    if (vulnerabilities.length > 0) {
      const { error: vulnError } = await supabase.from('vulnerabilities').insert(vulnerabilities)
      if (vulnError) {
        console.error('Error inserting vulnerabilities:', vulnError)
      }
    }

    console.log('Scan completed successfully')

    return new Response(JSON.stringify({ 
      scan_id: scan.id,
      campaign_id: campaign.id,
      status: 'completed',
      results: simulatedResults 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in nmap-scanner:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
