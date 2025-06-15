
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Bluetooth, Search, Play, Square, Shield, AlertTriangle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WirelessScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("wifi");
  const { toast } = useToast();

  // Mock WiFi networks data
  const [wifiNetworks] = useState([
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
  ]);

  // Mock Bluetooth devices data
  const [bluetoothDevices] = useState([
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
  ]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "Wireless Scan Complete",
            description: `${activeTab === 'wifi' ? 'WiFi' : 'Bluetooth'} scan completed successfully`,
          });
          return 100;
        }
        return prev + 8;
      });
    }, 400);

    console.log(`Starting ${activeTab} scan`);
  };

  const handleStopScan = () => {
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
                WiFi Networks ({wifiNetworks.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wifiNetworks.map((network, index) => {
                  const security = getSecurityLevel(network.security);
                  const signal = getSignalStrength(network.signal);
                  
                  return (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Wifi size={18} className="text-blue-400" />
                          <div>
                            <span className="text-white font-medium">{network.ssid}</span>
                            <p className="text-xs text-gray-400">{network.bssid}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={security.color}>
                            {security.icon}
                            <span className="ml-1">{network.security}</span>
                          </Badge>
                          <span className={`text-sm ${signal.color}`}>{signal.strength}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Signal:</span>
                          <span className="text-white ml-2">{network.signal} dBm</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Channel:</span>
                          <span className="text-white ml-2">{network.channel}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Frequency:</span>
                          <span className="text-white ml-2">{network.frequency}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Vendor:</span>
                          <span className="text-white ml-2">{network.vendor}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bluetooth">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bluetooth size={20} />
                Bluetooth Devices ({bluetoothDevices.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bluetoothDevices.map((device, index) => {
                  const signal = getSignalStrength(device.rssi);
                  
                  return (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Bluetooth size={18} className="text-blue-400" />
                          <div>
                            <span className="text-white font-medium">{device.name}</span>
                            <p className="text-xs text-gray-400">{device.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{device.deviceClass}</Badge>
                          <span className={`text-sm ${signal.color}`}>{signal.strength}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">RSSI:</span>
                          <span className="text-white ml-2">{device.rssi} dBm</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Version:</span>
                          <span className="text-white ml-2">BT {device.version}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Manufacturer:</span>
                          <span className="text-white ml-2">{device.manufacturer}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-gray-400 text-sm">Services: </span>
                        <div className="flex gap-1 mt-1">
                          {device.services.map((service, serviceIndex) => (
                            <Badge key={serviceIndex} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
