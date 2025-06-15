import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Square, Shield, Bug, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

export const NetworkScanner = () => {
  const [target, setTarget] = useState("192.168.1.0/24");
  const [scanType, setScanType] = useState("network_scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [piiFindings, setPiiFindings] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const validateTarget = (target: string): boolean => {
    // Basic validation for IP addresses and domains
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    
    return ipRegex.test(target) || domainRegex.test(target) || target === 'localhost';
  };

  const handleStartScan = async () => {
    console.log('Starting scan process...');
    setError(null);
    
    if (!target.trim()) {
      setError("Please enter a target IP or domain");
      return;
    }

    if (!validateTarget(target.trim())) {
      setError("Please enter a valid IP address, CIDR notation, or domain name");
      return;
    }

    if (!session) {
      setError("Please sign in to perform security scans.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    
    try {
      console.log('Session available, user ID:', user?.id);

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

      console.log(`Starting ${scanType} on ${target} with auth token`);

      const { data, error } = await supabase.functions.invoke('nmap-scanner', {
        body: { 
          target: target.trim(),
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
        setError(`Scan failed: ${error.message || 'Unknown error occurred'}`);
        toast({
          title: "Scan Failed",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
      } else {
        console.log('Scan completed successfully:', data);
        setError(null);
        toast({
          title: "Scan Complete",
          description: `${scanType.replace('_', ' ')} of ${target} completed successfully`,
        });
        
        // Refresh data
        await fetchScanData();
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      setError(`Network error: ${error.message || 'Failed to connect to scan service'}`);
      toast({
        title: "Scan Failed",
        description: "Network error occurred while starting the scan",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanProgress(0), 2000);
    }
  };

  const fetchScanData = async () => {
    if (!session) {
      console.log('No session available for fetching data');
      return;
    }

    try {
      setError(null);
      console.log('Fetching scan data...');
      
      // Fetch recent scans
      const { data: scans, error: scansError } = await supabase
        .from('scans')
        .select(`
          *,
          scan_campaigns!inner(user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (scansError) {
        console.error('Error fetching scans:', scansError);
        if (scansError.code === 'PGRST301') {
          console.log('No scan campaigns found');
        }
      } else if (scans) {
        console.log('Fetched scans:', scans.length);
        setScanResults(scans);
      }

      // Fetch recent vulnerabilities
      const { data: vulns, error: vulnsError } = await supabase
        .from('vulnerabilities')
        .select(`
          *,
          scans!inner(
            campaign_id,
            scan_campaigns!inner(user_id)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (vulnsError) {
        console.error('Error fetching vulnerabilities:', vulnsError);
      } else if (vulns) {
        console.log('Fetched vulnerabilities:', vulns.length);
        setVulnerabilities(vulns);
      }

      // Fetch recent PII findings
      const { data: pii, error: piiError } = await supabase
        .from('pii_findings')
        .select(`
          *,
          scans!inner(
            campaign_id,
            scan_campaigns!inner(user_id)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (piiError) {
        console.error('Error fetching PII findings:', piiError);
      } else if (pii) {
        console.log('Fetched PII findings:', pii.length);
        setPiiFindings(pii);
      }
    } catch (error: any) {
      console.error('Error fetching scan data:', error);
      setError('Failed to load scan history');
    }
  };

  useEffect(() => {
    if (session && user) {
      fetchScanData();
    }
  }, [session, user]);

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    setError(null);
    toast({
      title: "Scan Stopped",
      description: "Scan has been terminated",
    });
  };

  const handleRefresh = async () => {
    await fetchScanData();
    toast({
      title: "Data Refreshed",
      description: "Scan history has been updated",
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

  const formatScanType = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Advanced Security Scanner</h1>
        <p className="text-gray-400 mt-1">Professional security assessment with Nmap, OpenVAS, and PII detection</p>
      </div>

      {error && (
        <Alert className="bg-red-900/50 border-red-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!session && (
        <Alert className="bg-yellow-900/50 border-yellow-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            Please sign in to access the security scanner functionality.
          </AlertDescription>
        </Alert>
      )}

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
                disabled={isScanning || !session}
              />
              <p className="text-xs text-gray-500 mt-1">Enter IP address, CIDR notation, or domain name</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Scan Type</label>
              <Select value={scanType} onValueChange={setScanType} disabled={isScanning || !session}>
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
                disabled={isScanning || !target.trim() || !session}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Play size={16} className="mr-2" />
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
              <Button
                onClick={handleStopScan}
                disabled={!isScanning}
                variant="destructive"
              >
                <Square size={16} className="mr-2" />
                Stop
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isScanning || !session}
                variant="outline"
                size="icon"
              >
                <RefreshCw size={16} />
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
              <p className="text-xs text-gray-400 mt-2">Scanning {target} with {formatScanType(scanType)}...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield size={20} />
              Recent Scans ({scanResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanResults.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <p>No scans performed yet</p>
                  <p className="text-sm">Start your first security scan above</p>
                </div>
              ) : (
                scanResults.map((scan: any, index) => (
                  <div key={scan.id || index} className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          scan.status === 'completed' ? 'bg-green-500' : 
                          scan.status === 'running' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                        <span className="text-white font-medium">{scan.target}</span>
                        <span className="text-gray-400">({formatScanType(scan.scan_type)})</span>
                      </div>
                      <Badge variant={scan.status === 'completed' ? 'default' : 'destructive'}>
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(scan.created_at).toLocaleString()}
                    </div>
                    {scan.completed_at && (
                      <div className="text-xs text-green-400 mt-1">
                        Completed: {new Date(scan.completed_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bug size={20} />
              Critical Vulnerabilities ({vulnerabilities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vulnerabilities.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bug className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <p>No vulnerabilities found</p>
                  <p className="text-sm">Run vulnerability scans to discover security issues</p>
                </div>
              ) : (
                vulnerabilities.map((vuln: any, index) => (
                  <div key={vuln.id || index} className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{vuln.title}</span>
                      <Badge className={getSeverityColor(vuln.severity)}>
                        {vuln.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{vuln.affected_target}</div>
                    {vuln.port && (
                      <div className="text-xs text-blue-400 mb-1">Port: {vuln.port}</div>
                    )}
                    <div className="text-xs text-gray-400">
                      CVE: {vuln.cve_id || 'N/A'} | CVSS: {vuln.cvss_score || 'N/A'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {piiFindings.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText size={20} />
              PII Exposure Findings ({piiFindings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {piiFindings.map((finding: any, index) => (
                <div key={finding.id || index} className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{finding.pii_type.toUpperCase()}</span>
                    <Badge className={getSeverityColor(finding.risk_level)}>
                      {finding.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">{finding.file_path}</div>
                  {finding.context_snippet && (
                    <div className="text-xs text-gray-400 font-mono bg-gray-800 p-2 rounded">
                      {finding.context_snippet}
                    </div>
                  )}
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
