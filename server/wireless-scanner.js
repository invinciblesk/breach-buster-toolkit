
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Detect platform
function getPlatform() {
  const platform = os.platform();
  if (platform === 'linux') return 'linux';
  if (platform === 'darwin') return 'macos';
  if (platform === 'win32') return 'windows';
  return 'unknown';
}

// Execute command with promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command failed: ${error.message}`));
        return;
      }
      resolve(stdout);
    });
  });
}

// Parse iwlist output (Linux)
function parseIwlistOutput(output) {
  const networks = [];
  const cells = output.split('Cell ').slice(1);
  
  for (const cell of cells) {
    try {
      const ssidMatch = cell.match(/ESSID:"(.+?)"/);
      const bssidMatch = cell.match(/Address: ([A-F0-9:]{17})/);
      const channelMatch = cell.match(/Channel:(\d+)/);
      const signalMatch = cell.match(/Signal level=(-?\d+)/);
      const encryptionMatch = cell.match(/Encryption key:(on|off)/);
      const wpaMatch = cell.match(/IE: IEEE 802\.11i\/WPA2/);
      const wpa3Match = cell.match(/WPA3/);
      
      if (ssidMatch && bssidMatch) {
        let security = 'Open';
        if (wpa3Match) security = 'WPA3-PSK';
        else if (wpaMatch) security = 'WPA2-PSK';
        else if (encryptionMatch?.[1] === 'on') security = 'WEP';
        
        networks.push({
          ssid: ssidMatch[1],
          bssid: bssidMatch[1],
          security,
          signal: signalMatch ? parseInt(signalMatch[1]) : -100,
          channel: channelMatch ? parseInt(channelMatch[1]) : 0,
          frequency: '2.4 GHz',
          vendor: 'Unknown',
          encryption: security === 'WPA3-PSK' || security === 'WPA2-PSK' ? 'AES' : 
                     security === 'WEP' ? 'WEP' : 'None'
        });
      }
    } catch (error) {
      console.error('Error parsing network cell:', error);
    }
  }
  
  return networks;
}

// Parse airport output (macOS)
function parseAirportOutput(output) {
  const networks = [];
  const lines = output.split('\n').slice(1);
  
  for (const line of lines) {
    try {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6) {
        const ssid = parts[0];
        const bssid = parts[1];
        const security = parts[2];
        const signal = parseInt(parts[3]);
        const channel = parseInt(parts[4]);
        const frequency = parts[5];
        
        networks.push({
          ssid,
          bssid,
          security: security.includes('WPA3') ? 'WPA3-PSK' : 
                   security.includes('WPA2') ? 'WPA2-PSK' :
                   security.includes('WEP') ? 'WEP' : 'Open',
          signal,
          channel,
          frequency: frequency.includes('5') ? '5 GHz' : '2.4 GHz',
          vendor: 'Unknown',
          encryption: security.includes('WPA') ? 'AES' : 
                     security.includes('WEP') ? 'WEP' : 'None'
        });
      }
    } catch (error) {
      console.error('Error parsing airport line:', error);
    }
  }
  
  return networks;
}

// Parse netsh output (Windows)
function parseNetshOutput(output) {
  const networks = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    const profileMatch = line.match(/SSID name\s*:\s*"(.+)"/);
    if (profileMatch) {
      networks.push({
        ssid: profileMatch[1].trim(),
        bssid: 'Unknown',
        security: 'WPA2-PSK',
        signal: -50,
        channel: 0,
        frequency: '2.4 GHz',
        vendor: 'Unknown',
        encryption: 'AES'
      });
    }
  }
  
  return networks;
}

// Parse hcitool output (Bluetooth)
function parseHcitoolOutput(output) {
  const devices = [];
  const lines = output.split('\n').slice(1);
  
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

// WiFi scanning endpoint
app.post('/scan/wifi', async (req, res) => {
  try {
    const platform = getPlatform();
    console.log(`Performing WiFi scan on ${platform}`);
    
    let networks = [];
    
    switch (platform) {
      case 'linux':
        try {
          const output = await executeCommand('sudo iwlist scan');
          networks = parseIwlistOutput(output);
        } catch (error) {
          console.log('iwlist failed, trying nmcli...');
          try {
            const output = await executeCommand('nmcli dev wifi');
            // Parse nmcli output if iwlist fails
            networks = [];
          } catch (nmcliError) {
            console.error('Both iwlist and nmcli failed:', nmcliError);
          }
        }
        break;
        
      case 'macos':
        try {
          const output = await executeCommand('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s');
          networks = parseAirportOutput(output);
        } catch (error) {
          console.error('airport scan failed:', error);
        }
        break;
        
      case 'windows':
        try {
          const output = await executeCommand('netsh wlan show profiles');
          networks = parseNetshOutput(output);
        } catch (error) {
          console.error('netsh scan failed:', error);
        }
        break;
        
      default:
        throw new Error('Unsupported platform');
    }
    
    res.json({
      success: true,
      platform,
      networks,
      timestamp: new Date().toISOString(),
      message: networks.length === 0 ? 
        'No networks found. Make sure you have the required permissions and tools installed.' : 
        undefined
    });
    
  } catch (error) {
    console.error('WiFi scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      platform: getPlatform()
    });
  }
});

// Bluetooth scanning endpoint
app.post('/scan/bluetooth', async (req, res) => {
  try {
    const platform = getPlatform();
    console.log(`Performing Bluetooth scan on ${platform}`);
    
    let devices = [];
    
    if (platform === 'linux') {
      try {
        const output = await executeCommand('hcitool scan');
        devices = parseHcitoolOutput(output);
      } catch (error) {
        console.error('hcitool scan failed:', error);
      }
    }
    
    res.json({
      success: true,
      platform,
      devices,
      timestamp: new Date().toISOString(),
      message: devices.length === 0 ? 
        'No Bluetooth devices found. Make sure Bluetooth is enabled and you have the required permissions.' : 
        undefined
    });
    
  } catch (error) {
    console.error('Bluetooth scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      platform: getPlatform()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: getPlatform(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Local wireless scanner server running on http://localhost:${PORT}`);
  console.log(`Platform: ${getPlatform()}`);
  console.log('Available endpoints:');
  console.log('  POST /scan/wifi - WiFi network scanning');
  console.log('  POST /scan/bluetooth - Bluetooth device scanning');
  console.log('  GET /health - Health check');
});
