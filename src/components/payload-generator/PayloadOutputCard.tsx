
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Send, Search } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  generatedPayload: string;
  handleCopyPayload: () => void;
  handleTestPayload: () => void;
  testingPayload: boolean;
  exploitResult?: string;
}

export const PayloadOutputCard: React.FC<Props> = ({
  generatedPayload,
  handleCopyPayload,
  handleTestPayload,
  testingPayload,
  exploitResult,
}) => {
  return (
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
  );
};
