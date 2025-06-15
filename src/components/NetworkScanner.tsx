
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Pause, Square, Shield, Bug, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NetworkScanner = () => {
  const [target, setTarget] = useState("192.168.1.0/24");
  const [scanType, setScanType] = useState("network_scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [piiFindings, setPiiFindings] = useState([]);
  const { toast } = useToast();

  const handleStartScan = async () => {
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
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to perform scans",
          variant: "destructive",
        });
        setIsScanning(false);
        return;
      }

      // Simulate scan progress
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      let scanFunction = '';
      switch (scanType) {
        case 'network_scan':
          scanFunction = 'nmap-scanner';
          break;
        case 'vulnerability_scan':
          scanFunction = 'vulnerability-scanner';
          break;
        case 'pii_scan':
          scanFunction = 'pii-scanner';
          break;
        default:
          scanFunction = 'nmap-scanner';
      }

      console.log(`Starting ${scanType} on ${target}`);

      const { data, error } = await supabase.functions.invoke(scanFunction, {
        body: { 
          target,
          scanType,
          parameters: {
            timeout: 300,
            aggressive: scanType === 'vulnerability_scan'
          }
        }
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (error) {
        console.error('Scan error:', error);
        toast({
          title: "Scan Failed",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
      } else {
        console.log('Scan completed:', data);
        toast({
          title: "Scan Complete",
          description: `${scanType.replace('_', ' ')} of ${target} completed successfully`,
        });
        
        // Refresh data
        await fetchScanData();
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "An error occurred while starting the scan",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const fetchScanData = async () => {
    try {
      // Fetch recent scans
      const { data: scans } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (scans) {
        setScanResults(scans);
      }

      // Fetch recent vulnerabilities
      const { data: vulns } = await supabase
        .from('vulnerabilities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (vulns) {
        setVulnerabilities(vulns);
      }

      // Fetch recent PII findings
      const { data: pii } = await supabase
        .from('pii_findings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (pii) {
        setPiiFindings(pii);
      }
    } catch (error) {
      console.error('Error fetching scan data:', error);
    }
  };

  useEffect(() => {
    fetchScanData();
  }, []);

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan Stopped",
      description: "Scan has been terminated",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Advanced Security Scanner</h1>
        <p className="text-gray-400 mt-1">Professional security assessment with Nmap, OpenVAS, and PII detection</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search size={20} />
            Scan Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
              <Input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="192.168.1.0/24 or domain.com"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isScanning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Scan Type</label>
              <Select value={scanType} onValueChange={setScanType} disabled={isScanning}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="network_scan">Network Discovery (Nmap)</SelectItem>
                  <SelectItem value="vulnerability_scan">Vulnerability Assessment (OpenVAS)</SelectItem>
                  <SelectItem value="pii_scan">PII Detection Scan</SelectItem>
                </SelectContent>
              </Select>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield size={20} />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanResults.map((scan: any, index) => (
                <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        scan.status === 'completed' ? 'bg-green-500' : 
                        scan.status === 'running' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-white font-medium">{scan.target}</span>
                      <span className="text-gray-400">({scan.scan_type})</span>
                    </div>
                    <Badge variant={scan.status === 'completed' ? 'default' : 'destructive'}>
                      {scan.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(scan.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bug size={20} />
              Critical Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vulnerabilities.map((vuln: any, index) => (
                <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{vuln.title}</span>
                    <Badge className={getSeverityColor(vuln.severity)}>
                      {vuln.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{vuln.affected_target}</div>
                  <div className="text-xs text-gray-400">
                    CVE: {vuln.cve_id || 'N/A'} | CVSS: {vuln.cvss_score || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {piiFindings.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText size={20} />
              PII Exposure Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {piiFindings.map((finding: any, index) => (
                <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{finding.pii_type.toUpperCase()}</span>
                    <Badge className={getSeverityColor(finding.risk_level)}>
                      {finding.risk_level}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">{finding.file_path}</div>
                  <div className="text-xs text-gray-400 font-mono bg-gray-800 p-2 rounded">
                    {finding.context_snippet}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Confidence: {(finding.confidence_score * 100).toFixed(1)}% | 
                    Encrypted: {finding.is_encrypted ? 'Yes' : 'No'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
