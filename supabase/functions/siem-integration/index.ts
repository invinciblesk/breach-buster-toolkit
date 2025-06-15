
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

    const { event_type, vulnerability_data, integration_type = 'splunk' } = await req.json()

    // Get SIEM tool configuration
    const { data: tool, error: toolError } = await supabase
      .from('security_tools')
      .select('*')
      .eq('type', integration_type)
      .eq('is_active', true)
      .single()

    if (toolError || !tool) {
      console.error('SIEM tool not configured:', toolError)
      return new Response(JSON.stringify({ error: 'SIEM integration not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Format event for SIEM
    const siemEvent = {
      timestamp: new Date().toISOString(),
      source: 'CyberPen Pro',
      event_type: event_type,
      severity: vulnerability_data?.severity || 'info',
      description: vulnerability_data?.title || 'Security event',
      details: vulnerability_data,
      host: vulnerability_data?.affected_target,
      port: vulnerability_data?.port,
      service: vulnerability_data?.service
    }

    console.log(`Sending event to ${integration_type}:`, siemEvent)

    // In a real implementation, you would send this to actual SIEM systems
    // For demo purposes, we'll simulate the integration
    const simulatedResponse = {
      status: 'success',
      event_id: `${integration_type}_${Date.now()}`,
      ingested_at: new Date().toISOString()
    }

    // Log the integration attempt
    const { error: logError } = await supabase
      .from('integration_logs')
      .insert({
        tool_id: tool.id,
        event_type: event_type,
        payload: siemEvent,
        response: simulatedResponse,
        status: 'success'
      })

    if (logError) {
      console.error('Error logging integration:', logError)
    }

    return new Response(JSON.stringify({ 
      success: true,
      siem_response: simulatedResponse,
      message: `Event successfully sent to ${integration_type}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in siem-integration:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
