import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Bluetooth, Search, Play, Square, Shield, AlertTriangle, Lock, Download, Server, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

type WifiNetwork = {
  ssid: string;
  bssid: string;
  security: string;
  signal: number;
  channel: number;
  frequency: string;
  vendor: string;
  encryption: string;
};

type BluetoothDevice = {
  name: string;
  address: string;
  deviceClass: string;
  rssi: number;
  services: string[];
  manufacturer: string;
  version: string;
};

const mockWifiData: WifiNetwork[] = [
  { 
    ssid: "HomeNetwork_5G", 
    bssid: "AA:BB:CC:DD:EE:FF", 
    security: "WPA2-PSK", 
    signal: -45, 
    channel: 36, 
    frequency: "5.18 GHz",
    vendor: "Netgear",
    encryption: "AES"
  },
  { 
    ssid: "Office_WiFi", 
    bssid: "11:22:33:44:55:66", 
    security: "WPA3-PSK", 
    signal: -60, 
    channel: 6, 
    frequency: "2.437 GHz",
    vendor: "Cisco",
    encryption: "AES"
  },
  { 
    ssid: "Guest_Network", 
    bssid: "77:88:99:AA:BB:CC", 
    security: "Open", 
    signal: -70, 
    channel: 11, 
    frequency: "2.462 GHz",
    vendor: "TP-Link",
    encryption: "None"
  },
  { 
    ssid: "Legacy_Router", 
    bssid: "DD:EE:FF:00:11:22", 
    security: "WEP", 
    signal: -80, 
    channel: 1, 
    frequency: "2.412 GHz",
    vendor: "Linksys",
    encryption: "WEP"
  },
];

const mockBluetoothData: BluetoothDevice[] = [
  {
    name: "iPhone 13",
    address: "AA:BB:CC:DD:EE:01",
    deviceClass: "Phone",
    rssi: -45,
    services: ["HID", "A2DP", "AVRCP"],
    manufacturer: "Apple",
    version: "5.0"
  },
  {
    name: "AirPods Pro",
    address: "BB:CC:DD:EE:FF:02",
    deviceClass: "Audio",
    rssi: -55,
    services: ["A2DP", "HFP"],
    manufacturer: "Apple",
    version: "5.0"
  },
  {
    name: "Dell Keyboard",
    address: "CC:DD:EE:FF:00:03",
    deviceClass: "Peripheral",
    rssi: -65,
    services: ["HID"],
    manufacturer: "Dell",
    version: "4.2"
  },
  {
    name: "Unknown Device",
    address: "DD:EE:FF:00:11:04",
    deviceClass: "Unknown",
    rssi: -75,
    services: ["Unknown"],
    manufacturer: "Unknown",
    version: "Unknown"
  },
];

export const WirelessScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("wifi");
  const [useLocalScanning, setUseLocalScanning] = useState(true);
  const [scanResults, setScanResults] = useState<any>(null);
  const [localServerStatus, setLocalServerStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const { toast } = useToast();
  const { session } = useAuth();
  const [foundWifiNetworks, setFoundWifiNetworks] = useState<WifiNetwork[]>([]);
  const [foundBluetoothDevices, setFoundBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check local server status on component mount
  useEffect(() => {
    checkLocalServerStatus();
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const checkLocalServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        setLocalServerStatus('available');
        console.log('Local wireless scanner server is available');
      } else {
        setLocalServerStatus('unavailable');
      }
    } catch (error) {
      setLocalServerStatus('unavailable');
      console.log('Local wireless scanner server is not running');
    }
  };

  const handleLocalScan = async () => {
    console.log(`Starting local ${activeTab} scan`);
    setIsScanning(true);
    setScanProgress(0);
    
    if (activeTab === 'wifi') {
      setFoundWifiNetworks([]);
    } else {
      setFoundBluetoothDevices([]);
    }

    try {
      // Simulate progress during backend call
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const endpoint = activeTab === 'wifi' ? '/scan/wifi' : '/scan/bluetooth';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Local scan results:', data);
      setScanResults(data);

      if (data.success) {
        if (activeTab === 'wifi' && data.networks) {
          setFoundWifiNetworks(data.networks);
          toast({
            title: "Local WiFi Scan Complete",
            description: `Found ${data.networks.length} networks on ${data.platform}`,
          });
        } else if (activeTab === 'bluetooth' && data.devices) {
          setFoundBluetoothDevices(data.devices);
          toast({
            title: "Local Bluetooth Scan Complete", 
            description: `Found ${data.devices.length} devices on ${data.platform}`,
          });
        }

        if (data.message) {
          toast({
            title: "Scan Information",
            description: data.message,
          });
        }
      } else {
        throw new Error(data.error || 'Local scan failed');
      }

    } catch (error: any) {
      console.error('Local scan error:', error);
      toast({
        title: "Local Scan Failed",
        description: `${error.message}. Falling back to demo mode.`,
        variant: "destructive",
      });
      // Fallback to mock data
      handleMockScan();
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanProgress(0), 2000);
    }
  };

  const handleMockScan = () => {
    console.log(`Starting mock ${activeTab} wireless scan`);
    
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    setIsScanning(true);
    setScanProgress(0);
    
    if (activeTab === 'wifi') {
      setFoundWifiNetworks([]);
    } else {
      setFoundBluetoothDevices([]);
    }

    const dataToScan = activeTab === 'wifi' ? mockWifiData : mockBluetoothData;
    const totalItems = dataToScan.length;
    let itemsAdded = 0;

    scanIntervalRef.current = setInterval(() => {
      if (itemsAdded < totalItems) {
        const newItem = dataToScan[itemsAdded];
        if (activeTab === 'wifi') {
          setFoundWifiNetworks(prev => [...prev, newItem as WifiNetwork]);
          console.log(`Found WiFi network: ${(newItem as WifiNetwork).ssid}`);
        } else {
          setFoundBluetoothDevices(prev => [...prev, newItem as BluetoothDevice]);
          console.log(`Found Bluetooth device: ${(newItem as BluetoothDevice).name}`);
        }
        itemsAdded++;
        setScanProgress(Math.round((itemsAdded / totalItems) * 100));
      } else {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setScanProgress(100);
        toast({
          title: "Demo Scan Complete",
          description: `Demo ${activeTab === 'wifi' ? 'WiFi' : 'Bluetooth'} scan completed. Found ${totalItems} ${activeTab === 'wifi' ? 'networks' : 'devices'}.`,
        });
        setTimeout(() => setScanProgress(0), 2000);
      }
    }, 800);
  };

  const handleStartScan = () => {
    if (useLocalScanning && localServerStatus === 'available') {
      handleLocalScan();
    } else {
      handleMockScan();
    }
  };

  const handleStopScan = () => {
    console.log('Stopping wireless scan');
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan Stopped",
      description: "Wireless scan has been terminated",
    });
  };

  const getSecurityLevel = (security: string) => {
    switch (security.toLowerCase()) {
      case "wpa3-psk":
      case "wpa3":
        return { level: "high", color: "bg-green-600", icon: <Shield size={14} /> };
      case "wpa2-psk":
      case "wpa2":
        return { level: "medium", color: "bg-yellow-600", icon: <Lock size={14} /> };
      case "wep":
        return { level: "low", color: "bg-red-600", icon: <AlertTriangle size={14} /> };
      case "open":
        return { level: "none", color: "bg-red-700", icon: <AlertTriangle size={14} /> };
      default:
        return { level: "unknown", color: "bg-gray-600", icon: <Shield size={14} /> };
    }
  };

  const getSignalStrength = (signal: number) => {
    if (signal > -50) return { strength: "Excellent", color: "text-green-400" };
    if (signal > -60) return { strength: "Good", color: "text-yellow-400" };
    if (signal > -70) return { strength: "Fair", color: "text-orange-400" };
    return { strength: "Poor", color: "text-red-400" };
  };

  const handleDownloadClick = (platform: 'Android' | 'iOS') => {
    console.log(`Download requested for ${platform}`);
    toast({
      title: 'Coming Soon!',
      description: `The ${platform} app is not yet available. This feature will enable live network scanning directly from your device.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Wireless Scanner</h1>
        <p className="text-gray-400 mt-1">Discover WiFi networks and Bluetooth devices with real local scanning</p>
      </div>

      {localServerStatus === 'available' && (
        <Alert className="bg-green-900/50 border-green-600">
          <Server className="h-4 w-4" />
          <AlertDescription className="text-green-200">
            Local wireless scanner server is running on localhost:3001. Real scanning is available!
          </AlertDescription>
        </Alert>
      )}

      {localServerStatus === 'unavailable' && (
        <Alert className="bg-yellow-900/50 border-yellow-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            Local scanner server not detected. Install dependencies with `cd server && npm install` then run `npm start`. Using demo mode for now.
          </AlertDescription>
        </Alert>
      )}

      {scanResults && scanResults.platform && (
        <Alert className="bg-blue-900/50 border-blue-600">
          <Cpu className="h-4 w-4" />
          <AlertDescription className="text-blue-200">
            Local scanning performed on {scanResults.platform} platform. 
            {scanResults.message && ` ${scanResults.message}`}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search size={20} />
            Scan Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="localScanning"
                checked={useLocalScanning}
                onChange={(e) => setUseLocalScanning(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="localScanning" className="text-gray-300 text-sm">
                Use Local Scanning Server ({localServerStatus})
              </label>
            </div>
            <Button
              onClick={checkLocalServerStatus}
              disabled={isScanning}
              variant="outline"
              size="sm"
            >
              Refresh Status
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="bg-gray-700">
                <TabsTrigger value="wifi" className="flex items-center gap-2">
                  <Wifi size={16} />
                  WiFi Networks
                </TabsTrigger>
                <TabsTrigger value="bluetooth" className="flex items-center gap-2">
                  <Bluetooth size={16} />
                  Bluetooth Devices
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              <Button
                onClick={handleStartScan}
                disabled={isScanning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play size={16} className="mr-2" />
                {useLocalScanning && localServerStatus === 'available' ? 'Local Scan' : 'Demo Scan'}
              </Button>
              <Button
                onClick={handleStopScan}
                disabled={!isScanning}
                variant="destructive"
              >
                <Square size={16} className="mr-2" />
                Stop
              </Button>
            </div>
          </div>

          {isScanning && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">
                  {useLocalScanning && localServerStatus === 'available' ? 'Local' : 'Demo'} Scanning {activeTab === 'wifi' ? 'WiFi Networks' : 'Bluetooth Devices'}
                </span>
                <span className="text-green-400">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-gray-700" />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="wifi">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wifi size={20} />
                WiFi Networks ({foundWifiNetworks.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-300">SSID</TableHead>
                    <TableHead className="text-gray-300">BSSID</TableHead>
                    <TableHead className="text-gray-300">Signal</TableHead>
                    <TableHead className="text-gray-300">Channel</TableHead>
                    <TableHead className="text-gray-300">Security</TableHead>
                    <TableHead className="text-gray-300">Vendor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foundWifiNetworks.map((network, index) => {
                    const security = getSecurityLevel(network.security);
                    const signal = getSignalStrength(network.signal);
                    return (
                      <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell className="font-medium text-white">{network.ssid}</TableCell>
                        <TableCell className="text-gray-400">{network.bssid}</TableCell>
                        <TableCell className={signal.color}>{network.signal} dBm</TableCell>
                        <TableCell className="text-white">{network.channel}</TableCell>
                        <TableCell>
                          <Badge className={security.color}>
                            {security.icon}
                            <span className="ml-1">{network.security}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{network.vendor}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {foundWifiNetworks.length === 0 && !isScanning && (
                <div className="text-center py-10 text-gray-500">
                  No WiFi networks found. Start a scan to discover networks.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bluetooth">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bluetooth size={20} />
                Bluetooth Devices ({foundBluetoothDevices.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Address</TableHead>
                    <TableHead className="text-gray-300">RSSI</TableHead>
                    <TableHead className="text-gray-300">Class</TableHead>
                    <TableHead className="text-gray-300">Manufacturer</TableHead>
                    <TableHead className="text-gray-300">Services</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foundBluetoothDevices.map((device, index) => {
                    const signal = getSignalStrength(device.rssi);
                    return (
                      <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
                        <TableCell className="font-medium text-white">{device.name}</TableCell>
                        <TableCell className="text-gray-400">{device.address}</TableCell>
                        <TableCell className={signal.color}>{device.rssi} dBm</TableCell>
                        <TableCell><Badge variant="outline">{device.deviceClass}</Badge></TableCell>
                        <TableCell className="text-white">{device.manufacturer}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {device.services.map((service, serviceIndex) => (
                              <Badge key={serviceIndex} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {foundBluetoothDevices.length === 0 && !isScanning && (
                <div className="text-center py-10 text-gray-500">
                  No Bluetooth devices found. Start a scan to discover devices.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server size={20} />
            Local Scanning Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Quick Setup:</h4>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
                <div className="text-gray-400"># Install and start the local scanner server</div>
                <div className="text-green-400">cd server</div>
                <div className="text-green-400">npm install</div>
                <div className="text-green-400">npm start</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Platform Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Linux:</strong> sudo access for iwlist/nmcli (WiFi) and hcitool (Bluetooth)</li>
                <li><strong>macOS:</strong> airport utility (WiFi) - may require developer tools</li>
                <li><strong>Windows:</strong> netsh wlan (limited WiFi info) - run as administrator</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Permissions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>WiFi scanning may require elevated privileges</li>
                <li>Bluetooth scanning requires Bluetooth to be enabled</li>
                <li>Some tools may need to be installed separately (iwlist, hcitool, etc.)</li>
              </ul>
            </div>
            <Alert className="bg-blue-900/50 border-blue-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                The local scanner server must be running for real wireless scanning. If the server is not available, the application will automatically fall back to demo mode.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download size={20} />
            Get Live Scanning on Mobile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            For security reasons, web browsers cannot access your device's WiFi hardware. To perform a live scan, please download our mobile application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => handleDownloadClick('Android')} className="bg-blue-600 hover:bg-blue-700 flex-1">
              <Download size={16} className="mr-2" />
              Download for Android
            </Button>
            <Button onClick={() => handleDownloadClick('iOS')} className="bg-gray-600 hover:bg-gray-700 flex-1" disabled>
              <Download size={16} className="mr-2" />
              Download for iOS (Coming Soon)
            </Button>
          </div>
           <p className="text-xs text-gray-500 mt-4">Note: Live scanning is currently supported on Android. iOS has platform restrictions that prevent WiFi scanning by third-party apps.</p>
        </CardContent>
      </Card>
    </div>
  );
};
