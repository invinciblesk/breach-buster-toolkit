
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WifiNetwork {
  ssid: string;
  bssid: string;
  security: string;
  signal: number;
  channel: number;
  frequency: string;
  vendor: string;
  encryption: string;
}

interface BluetoothDevice {
  name: string;
  address: string;
  deviceClass: string;
  rssi: number;
  services: string[];
  manufacturer: string;
  version: string;
}

async function executeCommand(command: string[]): Promise<string> {
  try {
    const process = new Deno.Command(command[0], {
      args: command.slice(1),
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await process.output();
    
    if (code === 0) {
      return new TextDecoder().decode(stdout);
    } else {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(`Command failed with code ${code}: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Command execution error:', error);
    throw error;
  }
}

async function scanWifiLinux(): Promise<WifiNetwork[]> {
  try {
    const output = await executeCommand(['iwlist', 'scan']);
    return parseIwlistOutput(output);
  } catch (error) {
    console.error('Linux WiFi scan failed:', error);
    return [];
  }
}

async function scanWifiMacOS(): Promise<WifiNetwork[]> {
  try {
    const output = await executeCommand(['/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', '-s']);
    return parseAirportOutput(output);
  } catch (error) {
    console.error('macOS WiFi scan failed:', error);
    return [];
  }
}

async function scanWifiWindows(): Promise<WifiNetwork[]> {
  try {
    const output = await executeCommand(['netsh', 'wlan', 'show', 'profiles']);
    return parseNetshOutput(output);
  } catch (error) {
    console.error('Windows WiFi scan failed:', error);
    return [];
  }
}

function parseIwlistOutput(output: string): WifiNetwork[] {
  const networks: WifiNetwork[] = [];
  const cells = output.split('Cell ').slice(1);
  
  for (const cell of cells) {
    try {
      const ssidMatch = cell.match(/ESSID:"(.+?)"/);
      const bssidMatch = cell.match(/Address: ([A-F0-9:]{17})/);
      const channelMatch = cell.match(/Channel:(\d+)/);
      const signalMatch = cell.match(/Signal level=(-?\d+)/);
      const encryptionMatch = cell.match(/Encryption key:(on|off)/);
      const wpaMatch = cell.match(/IE: IEEE 802\.11i\/WPA2/);
      
      if (ssidMatch && bssidMatch) {
        networks.push({
          ssid: ssidMatch[1],
          bssid: bssidMatch[1],
          security: wpaMatch ? 'WPA2-PSK' : encryptionMatch?.[1] === 'on' ? 'WEP' : 'Open',
          signal: signalMatch ? parseInt(signalMatch[1]) : -100,
          channel: channelMatch ? parseInt(channelMatch[1]) : 0,
          frequency: '2.4 GHz',
          vendor: 'Unknown',
          encryption: wpaMatch ? 'AES' : encryptionMatch?.[1] === 'on' ? 'WEP' : 'None'
        });
      }
    } catch (error) {
      console.error('Error parsing network cell:', error);
    }
  }
  
  return networks;
}

function parseAirportOutput(output: string): WifiNetwork[] {
  const networks: WifiNetwork[] = [];
  const lines = output.split('\n').slice(1); // Skip header
  
  for (const line of lines) {
    try {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6) {
        networks.push({
          ssid: parts[0],
          bssid: parts[1],
          security: parts[2].includes('WPA2') ? 'WPA2-PSK' : parts[2].includes('WEP') ? 'WEP' : 'Open',
          signal: parseInt(parts[3]),
          channel: parseInt(parts[4]),
          frequency: parts[5].includes('5') ? '5 GHz' : '2.4 GHz',
          vendor: 'Unknown',
          encryption: parts[2].includes('WPA2') ? 'AES' : parts[2].includes('WEP') ? 'WEP' : 'None'
        });
      }
    } catch (error) {
      console.error('Error parsing airport line:', error);
    }
  }
  
  return networks;
}

function parseNetshOutput(output: string): WifiNetwork[] {
  const networks: WifiNetwork[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    const profileMatch = line.match(/All User Profile\s*:\s*(.+)/);
    if (profileMatch) {
      networks.push({
        ssid: profileMatch[1].trim(),
        bssid: 'Unknown',
        security: 'Unknown',
        signal: -50,
        channel: 0,
        frequency: '2.4 GHz',
        vendor: 'Unknown',
        encryption: 'Unknown'
      });
    }
  }
  
  return networks;
}

async function scanBluetooth(): Promise<BluetoothDevice[]> {
  try {
    // Try Linux hcitool
    const output = await executeCommand(['hcitool', 'scan']);
    return parseHcitoolOutput(output);
  } catch (error) {
    console.error('Bluetooth scan failed:', error);
    return [];
  }
}

function parseHcitoolOutput(output: string): BluetoothDevice[] {
  const devices: BluetoothDevice[] = [];
  const lines = output.split('\n').slice(1); // Skip header
  
  for (const line of lines) {
    const match = line.match(/([A-F0-9:]{17})\s+(.+)/);
    if (match) {
      devices.push({
        name: match[2].trim(),
        address: match[1],
        deviceClass: 'Unknown',
        rssi: -60,
        services: ['Unknown'],
        manufacturer: 'Unknown',
        version: 'Unknown'
      });
    }
  }
  
  return devices;
}

async function detectPlatform(): Promise<string> {
  try {
    const process = new Deno.Command('uname', {
      args: ['-s'],
      stdout: "piped",
    });
    const { stdout } = await process.output();
    const platform = new TextDecoder().decode(stdout).trim().toLowerCase();
    
    if (platform.includes('linux')) return 'linux';
    if (platform.includes('darwin')) return 'macos';
    return 'unknown';
  } catch (error) {
    // Fallback detection
    if (Deno.build.os === 'linux') return 'linux';
    if (Deno.build.os === 'darwin') return 'macos';
    if (Deno.build.os === 'windows') return 'windows';
    return 'unknown';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const requestBody = await req.json()
    const { scanType } = requestBody

    console.log(`Starting ${scanType} scan for user ${user.id}`)

    const platform = await detectPlatform()
    console.log(`Detected platform: ${platform}`)

    let results: any = {
      platform,
      scanType,
      timestamp: new Date().toISOString(),
      networks: [],
      devices: []
    }

    if (scanType === 'wifi') {
      console.log('Performing WiFi scan...')
      
      switch (platform) {
        case 'linux':
          results.networks = await scanWifiLinux();
          break;
        case 'macos':
          results.networks = await scanWifiMacOS();
          break;
        case 'windows':
          results.networks = await scanWifiWindows();
          break;
        default:
          console.log('Platform not supported for real scanning, using fallback')
          results.networks = [];
      }
      
      console.log(`Found ${results.networks.length} WiFi networks`)
      
    } else if (scanType === 'bluetooth') {
      console.log('Performing Bluetooth scan...')
      
      if (platform === 'linux') {
        results.devices = await scanBluetooth();
      }
      
      console.log(`Found ${results.devices.length} Bluetooth devices`)
    }

    // If no real results were found, provide a helpful message
    if (results.networks.length === 0 && results.devices.length === 0) {
      results.message = `Real scanning attempted on ${platform} but no ${scanType} devices found. This could be due to:
- Missing system permissions
- Required tools not installed (iwlist, hcitool, etc.)
- No networks/devices in range
- Platform limitations in serverless environment`;
    }

    return new Response(JSON.stringify({
      success: true,
      results,
      realScan: true,
      platform
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Wireless scan error:', error)
    return new Response(JSON.stringify({ 
      error: 'Scan failed',
      message: error.message,
      realScan: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
