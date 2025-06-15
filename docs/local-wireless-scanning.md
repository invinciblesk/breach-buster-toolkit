
# Local Wireless Scanning Setup

This guide explains how to set up real wireless scanning on your local machine.

## Quick Start

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Start the Scanner Server**
   ```bash
   npm start
   ```

3. **Use the Interface**
   - Open the wireless scanner in your browser
   - Enable "Use Local Scanning Server"
   - Start scanning for real results

## Platform-Specific Requirements

### Linux
- **WiFi:** Requires `iwlist` (part of wireless-tools) or `nmcli`
- **Bluetooth:** Requires `hcitool` (part of bluez-utils)
- **Permissions:** May need sudo access for hardware scanning

```bash
# Install required tools (Ubuntu/Debian)
sudo apt-get install wireless-tools bluez-utils

# Install required tools (CentOS/RHEL)
sudo yum install wireless-tools bluez-utils
```

### macOS
- **WiFi:** Uses built-in `airport` utility
- **Bluetooth:** Limited support
- **Permissions:** May require Xcode command line tools

```bash
# Install Xcode command line tools if needed
xcode-select --install
```

### Windows
- **WiFi:** Uses built-in `netsh wlan` commands
- **Bluetooth:** Limited support
- **Permissions:** Run as Administrator for best results

## Running Commands

### WiFi Scanning
- **Linux:** `sudo iwlist scan` or `nmcli dev wifi`
- **macOS:** `/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s`
- **Windows:** `netsh wlan show profiles`

### Bluetooth Scanning
- **Linux:** `hcitool scan`
- **macOS/Windows:** Limited native support

## Troubleshooting

### Server Won't Start
- Check if port 3001 is available
- Ensure Node.js is installed
- Run `npm install` in the server directory

### No Networks Found
- Check if you have required permissions
- Ensure wireless tools are installed
- Try running commands manually to test

### Permission Denied
- Use sudo on Linux for wireless scanning
- Run as Administrator on Windows
- Check system security settings on macOS

## Security Notes

- The local server only accepts connections from localhost
- No data is stored or transmitted externally
- Scanning requires appropriate system permissions
- All scanning is performed using standard system tools

## API Endpoints

The local server provides these endpoints:

- `POST /scan/wifi` - Perform WiFi network scanning
- `POST /scan/bluetooth` - Perform Bluetooth device scanning
- `GET /health` - Check server status

## Integration

The wireless scanner frontend automatically detects if the local server is running and switches between local scanning and demo mode accordingly.
