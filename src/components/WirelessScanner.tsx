
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Wifi, 
  Bluetooth, 
  Search, 
  RefreshCw, 
  Shield, 
  SignalHigh, 
  SignalMedium, 
  SignalLow,
  Lock,
  Unlock,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WifiNetwork {
  ssid: string;
  bssid: string;
  rssi: number;
  frequency: string;
  encryption: string;
  channel: number;
}

interface BluetoothDevice {
  name: string;
  address: string;
  rssi: number;
  deviceType: string;
  lastSeen: string;
}

export const WirelessScanner = () => {
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([]);
  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [serverAvailable, setServerAvailable] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("wifi");

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch("http://localhost:3001/health");
      setServerAvailable(response.ok);
    } catch (error) {
      setServerAvailable(false);
    }
  };

  const simulateProgress = () => {
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const performWifiScan = async () => {
    setIsScanning(true);
    simulateProgress();
    
    try {
      let networks: WifiNetwork[];
      
      if (serverAvailable) {
        const response = await fetch("http://localhost:3001/scan/wifi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        if (response.ok) {
          const data = await response.json();
          networks = data.networks || [];
        } else {
          throw new Error("Server scan failed");
        }
      } else {
        // Demo data
        networks = [
          { ssid: "HomeNetwork_5G", bssid: "aa:bb:cc:dd:ee:ff", rssi: -45, frequency: "5.2 GHz", encryption: "WPA3", channel: 36 },
          { ssid: "CoffeeShop_WiFi", bssid: "11:22:33:44:55:66", rssi: -60, frequency: "2.4 GHz", encryption: "WPA2", channel: 6 },
          { ssid: "Office_Guest", bssid: "77:88:99:aa:bb:cc", rssi: -75, frequency: "2.4 GHz", encryption: "Open", channel: 11 },
        ];
      }
      
      setWifiNetworks(networks);
      setLastScanTime(new Date());
    } catch (error) {
      console.error("WiFi scan failed:", error);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const performBluetoothScan = async () => {
    setIsScanning(true);
    simulateProgress();
    
    try {
      let devices: BluetoothDevice[];
      
      if (serverAvailable) {
        const response = await fetch("http://localhost:3001/scan/bluetooth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        if (response.ok) {
          const data = await response.json();
          devices = data.devices || [];
        } else {
          throw new Error("Server scan failed");
        }
      } else {
        // Demo data
        devices = [
          { name: "iPhone 13", address: "AA:BB:CC:DD:EE:FF", rssi: -30, deviceType: "Phone", lastSeen: "2 minutes ago" },
          { name: "AirPods Pro", address: "11:22:33:44:55:66", rssi: -50, deviceType: "Audio", lastSeen: "5 minutes ago" },
          { name: "MacBook Pro", address: "77:88:99:AA:BB:CC", rssi: -65, deviceType: "Computer", lastSeen: "1 minute ago" },
        ];
      }
      
      setBluetoothDevices(devices);
      setLastScanTime(new Date());
    } catch (error) {
      console.error("Bluetooth scan failed:", error);
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const getSignalIcon = (rssi: number) => {
    if (rssi > -50) return <SignalHigh className="h-4 w-4 text-green-500" />;
    if (rssi > -70) return <SignalMedium className="h-4 w-4 text-yellow-500" />;
    return <SignalLow className="h-4 w-4 text-red-500" />;
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return "Excellent";
    if (rssi > -60) return "Good";
    if (rssi > -70) return "Fair";
    return "Weak";
  };

  const getSecurityIcon = (encryption: string) => {
    return encryption === "Open" ? 
      <Unlock className="h-4 w-4 text-red-500" /> : 
      <Lock className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Wireless Scanner
          </h1>
          <p className="text-gray-400 mt-2">
            Discover and analyze WiFi networks and Bluetooth devices in your environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkServerHealth}
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Server Status Alert */}
      <Alert className={cn(
        "border-l-4",
        serverAvailable 
          ? "border-l-green-500 bg-green-500/10 border-green-500/20" 
          : "border-l-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      )}>
        <div className="flex items-center gap-2">
          {serverAvailable ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
          <Server className="h-4 w-4" />
        </div>
        <AlertDescription className="ml-6">
          {serverAvailable ? (
            <span className="text-green-400">
              Local wireless scanner server is running - Real-time scanning enabled
            </span>
          ) : (
            <span className="text-yellow-400">
              Local server unavailable - Using demo mode. Run the local server for real scanning.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Scan Progress */}
      {isScanning && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Search className="h-5 w-5 text-green-400 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Scanning in progress...</span>
                  <span className="text-green-400">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Scan Info */}
      {lastScanTime && !isScanning && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          Last scan: {lastScanTime.toLocaleTimeString()}
        </div>
      )}

      {/* Main Scanner Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="wifi" 
            className="flex items-center gap-2 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
          >
            <Wifi className="h-4 w-4" />
            WiFi Networks ({wifiNetworks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="bluetooth"
            className="flex items-center gap-2 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-400"
          >
            <Bluetooth className="h-4 w-4" />
            Bluetooth Devices ({bluetoothDevices.length})
          </TabsTrigger>
        </TabsList>

        {/* WiFi Tab */}
        <TabsContent value="wifi" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-200">WiFi Networks</h2>
            <Button
              onClick={performWifiScan}
              disabled={isScanning}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isScanning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {serverAvailable ? "Scan WiFi" : "Demo Scan"}
            </Button>
          </div>

          <div className="grid gap-4">
            {wifiNetworks.map((network, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      {network.ssid}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getSignalIcon(network.rssi)}
                      {getSecurityIcon(network.encryption)}
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {network.bssid}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Signal:</span>
                      <div className="font-medium text-gray-200">
                        {network.rssi} dBm ({getSignalStrength(network.rssi)})
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Frequency:</span>
                      <div className="font-medium text-gray-200">{network.frequency}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Security:</span>
                      <Badge variant={network.encryption === "Open" ? "destructive" : "default"} className="ml-2">
                        {network.encryption}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400">Channel:</span>
                      <div className="font-medium text-gray-200">{network.channel}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {wifiNetworks.length === 0 && !isScanning && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6 text-center">
                <Wifi className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No WiFi networks found. Click "Scan WiFi" to discover networks.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Bluetooth Tab */}
        <TabsContent value="bluetooth" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-200">Bluetooth Devices</h2>
            <Button
              onClick={performBluetoothScan}
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isScanning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {serverAvailable ? "Scan Bluetooth" : "Demo Scan"}
            </Button>
          </div>

          <div className="grid gap-4">
            {bluetoothDevices.map((device, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                      <Bluetooth className="h-5 w-5" />
                      {device.name}
                    </CardTitle>
                    {getSignalIcon(device.rssi)}
                  </div>
                  <CardDescription className="text-gray-400">
                    {device.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Signal:</span>
                      <div className="font-medium text-gray-200">
                        {device.rssi} dBm ({getSignalStrength(device.rssi)})
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Device Type:</span>
                      <Badge variant="outline" className="ml-2">
                        {device.deviceType}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Seen:</span>
                      <div className="font-medium text-gray-200">{device.lastSeen}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {bluetoothDevices.length === 0 && !isScanning && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6 text-center">
                <Bluetooth className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No Bluetooth devices found. Click "Scan Bluetooth" to discover devices.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
