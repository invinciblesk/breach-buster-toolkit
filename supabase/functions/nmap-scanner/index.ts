
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

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
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
      await supabase.from('vulnerabilities').insert(vulnerabilities)
    }

    return new Response(JSON.stringify({ 
      scan_id: scan.id,
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
