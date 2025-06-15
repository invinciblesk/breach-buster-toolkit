
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PII_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
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

    const { target, fileContent, filePath } = await req.json()

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        scan_type: 'pii_scan',
        target: target,
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

    console.log(`Starting PII scan on ${target}`)

    // Simulate PII scanning
    const piiFindings = []
    
    for (const [piiType, pattern] of Object.entries(PII_PATTERNS)) {
      const matches = fileContent?.match(pattern) || []
      
      for (const match of matches) {
        piiFindings.push({
          scan_id: scan.id,
          file_path: filePath || '/simulated/path/to/file.txt',
          pii_type: piiType,
          confidence_score: 0.95,
          context_snippet: `...${match}...`,
          is_encrypted: false,
          risk_level: piiType === 'ssn' || piiType === 'credit_card' ? 'critical' : 'high'
        })
      }
    }

    // Add some simulated findings if no content provided
    if (!fileContent) {
      piiFindings.push(
        {
          scan_id: scan.id,
          file_path: '/var/www/html/customer_data.csv',
          pii_type: 'ssn',
          confidence_score: 0.98,
          context_snippet: 'John Doe,123-45-6789,Manager',
          is_encrypted: false,
          risk_level: 'critical'
        },
        {
          scan_id: scan.id,
          file_path: '/opt/app/logs/payment.log',
          pii_type: 'credit_card',
          confidence_score: 0.92,
          context_snippet: 'Card: 4532-1234-5678-9012',
          is_encrypted: false,
          risk_level: 'critical'
        }
      )
    }

    // Insert PII findings
    if (piiFindings.length > 0) {
      const { error: piiError } = await supabase
        .from('pii_findings')
        .insert(piiFindings)

      if (piiError) {
        console.error('Error inserting PII findings:', piiError)
      }
    }

    // Update scan status
    const { error: updateError } = await supabase
      .from('scans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        raw_output: JSON.stringify({ pii_findings: piiFindings.length })
      })
      .eq('id', scan.id)

    if (updateError) {
      console.error('Error updating scan:', updateError)
    }

    return new Response(JSON.stringify({ 
      scan_id: scan.id,
      status: 'completed',
      pii_findings: piiFindings.length,
      findings: piiFindings
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in pii-scanner:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
