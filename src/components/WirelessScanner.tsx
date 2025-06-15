import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Bluetooth, Search, Play, Square, Shield, AlertTriangle, Lock, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const { toast } = useToast();
  const [foundWifiNetworks, setFoundWifiNetworks] = useState<WifiNetwork[]>([]);
  const [foundBluetoothDevices, setFoundBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const handleStartScan = () => {
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
        } else {
          setFoundBluetoothDevices(prev => [...prev, newItem as BluetoothDevice]);
        }
        itemsAdded++;
        setScanProgress(Math.round((itemsAdded / totalItems) * 100));
      } else {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setScanProgress(100);
        toast({
          title: "Wireless Scan Complete",
          description: `${activeTab === 'wifi' ? 'WiFi' : 'Bluetooth'} scan completed successfully`,
        });
      }
    }, 800);

    console.log(`Starting ${activeTab} scan`);
  };

  const handleStopScan = () => {
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
    toast({
      title: 'Coming Soon!',
      description: `The ${platform} app is not yet available. This feature will enable live network scanning directly from your device.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Wireless Scanner</h1>
        <p className="text-gray-400 mt-1">Discover WiFi networks and Bluetooth devices</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search size={20} />
            Scan Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                Start Scan
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
                <span className="text-gray-300">Scanning {activeTab === 'wifi' ? 'WiFi Networks' : 'Bluetooth Devices'}</span>
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
