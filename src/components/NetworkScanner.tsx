import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Play, Pause, RotateCcw, Wifi, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NetworkScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [targetNetwork, setTargetNetwork] = useState("192.168.1.0/24");
  const [discoveredHosts, setDiscoveredHosts] = useState([
    {
      ip: "192.168.1.1",
      hostname: "router.local",
      mac: "00:11:22:33:44:55",
      vendor: "Cisco Systems",
      ports: [22, 80, 443],
      status: "up",
      os: "Linux",
      lastSeen: "2 min ago"
    },
    {
      ip: "192.168.1.100",
      hostname: "web-server.local", 
      mac: "AA:BB:CC:DD:EE:FF",
      vendor: "Dell Inc.",
      ports: [22, 80, 443, 3306],
      status: "up",
      os: "Ubuntu 20.04",
      lastSeen: "1 min ago"
    },
    {
      ip: "192.168.1.150",
      hostname: "desktop-pc",
      mac: "11:22:33:44:55:66",
      vendor: "Intel Corp.",
      ports: [135, 139, 445],
      status: "up", 
      os: "Windows 10",
      lastSeen: "5 min ago"
    }
  ]);

  const { toast } = useToast();

  const handleStartScan = () => {
    if (!targetNetwork) {
      toast({
        title: "Error",
        description: "Please enter a target network or IP range",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    toast({
      title: "Scan Started",
      description: `Scanning network: ${targetNetwork}`,
    });

    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "Scan Complete",
            description: `Found ${discoveredHosts.length} active hosts`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    console.log(`Starting network scan for: ${targetNetwork}`);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan Stopped",
      description: "Network scan has been stopped",
    });
    console.log("Stopping network scan");
  };

  const handlePortScan = (ip: string) => {
    toast({
      title: "Port Scan Started",
      description: `Scanning ports for ${ip}...`,
    });
    console.log(`Starting port scan for: ${ip}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up": return "bg-green-600";
      case "down": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getRiskLevel = (ports: number[]) => {
    const riskPorts = [21, 22, 23, 135, 139, 445, 3389];
    const hasRiskPorts = ports.some(port => riskPorts.includes(port));
    return hasRiskPorts ? "High" : "Low";
  };

  const getRiskColor = (risk: string) => {
    return risk === "High" ? "bg-red-600" : "bg-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Scan Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Network Discovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Network/IP Range
              </label>
              <Input
                value={targetNetwork}
                onChange={(e) => setTargetNetwork(e.target.value)}
                placeholder="192.168.1.0/24 or 10.0.0.1-10.0.0.100"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isScanning}
              />
            </div>
            <div className="flex items-end gap-2">
              {!isScanning ? (
                <Button onClick={handleStartScan} className="bg-green-600 hover:bg-green-700">
                  <Play size={16} className="mr-2" />
                  Start Scan
                </Button>
              ) : (
                <Button onClick={handleStopScan} variant="destructive">
                  <Pause size={16} className="mr-2" />
                  Stop Scan
                </Button>
              )}
            </div>
          </div>
          
          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Scanning Progress</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Hosts</CardTitle>
            <Wifi className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{discoveredHosts.length}</div>
            <p className="text-xs text-gray-400">Online devices</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Open Ports</CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {discoveredHosts.reduce((acc, host) => acc + host.ports.length, 0)}
            </div>
            <p className="text-xs text-gray-400">Discovered services</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {discoveredHosts.filter(host => getRiskLevel(host.ports) === "High").length}
            </div>
            <p className="text-xs text-gray-400">Potential vulnerabilities</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Scan Time</CardTitle>
            <RotateCcw className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.3s</div>
            <p className="text-xs text-gray-400">Last scan duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Discovered Hosts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Discovered Hosts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discoveredHosts.map((host, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-mono text-white">{host.ip}</div>
                    <Badge className={getStatusColor(host.status)}>
                      {host.status.toUpperCase()}
                    </Badge>
                    <Badge className={getRiskColor(getRiskLevel(host.ports))}>
                      {getRiskLevel(host.ports)} Risk
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => handlePortScan(host.ip)} className="bg-blue-600 hover:bg-blue-700">
                    <Search size={14} className="mr-1" />
                    Port Scan
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Hostname:</span>
                    <div className="text-white">{host.hostname}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">MAC Address:</span>
                    <div className="text-white font-mono">{host.mac}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Vendor:</span>
                    <div className="text-white">{host.vendor}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">OS:</span>
                    <div className="text-white">{host.os}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-gray-400 text-sm">Open Ports:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {host.ports.map((port) => (
                      <Badge key={port} variant="outline" className="text-xs">
                        {port}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Last seen: {host.lastSeen}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
