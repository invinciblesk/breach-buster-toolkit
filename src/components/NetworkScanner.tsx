
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Play, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NetworkScanner = () => {
  const [target, setTarget] = useState("192.168.1.0/24");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const { toast } = useToast();

  const [scanResults] = useState([
    { ip: "192.168.1.1", hostname: "router.local", status: "up", ports: ["22", "80", "443"] },
    { ip: "192.168.1.100", hostname: "web-server", status: "up", ports: ["80", "443", "8080"] },
    { ip: "192.168.1.101", hostname: "db-server", status: "up", ports: ["3306", "5432"] },
    { ip: "192.168.1.50", hostname: "workstation-01", status: "down", ports: [] },
  ]);

  const handleStartScan = () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP or range",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast({
            title: "Scan Complete",
            description: `Network scan of ${target} completed successfully`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    console.log("Starting network scan for:", target);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan Stopped",
      description: "Network scan has been terminated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Network Scanner</h1>
        <p className="text-gray-400 mt-1">Discover and analyze network hosts</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search size={20} />
            Scan Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
              <Input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="192.168.1.0/24 or single IP"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isScanning}
              />
            </div>
            <div className="flex items-end gap-2">
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
                <span className="text-gray-300">Scanning Progress</span>
                <span className="text-green-400">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-gray-700" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Scan Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scanResults.map((result, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${result.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-white font-medium">{result.ip}</span>
                    <span className="text-gray-400">({result.hostname})</span>
                  </div>
                  <Badge variant={result.status === 'up' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                </div>
                {result.ports.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Open Ports:</span>
                    <div className="flex gap-1">
                      {result.ports.map((port) => (
                        <Badge key={port} variant="outline" className="text-xs">
                          {port}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
