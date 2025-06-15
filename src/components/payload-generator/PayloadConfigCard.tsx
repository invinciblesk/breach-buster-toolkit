
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import { payloadTemplates } from "./payloadUtils";
import React from "react";

interface Props {
  payloadType: string;
  setPayloadType: (v: string) => void;
  target: string;
  setTarget: (v: string) => void;
  parameters: string;
  setParameters: (v: string) => void;
  onGenerate: () => void;
}

export const PayloadConfigCard: React.FC<Props> = ({
  payloadType,
  setPayloadType,
  target,
  setTarget,
  parameters,
  setParameters,
  onGenerate,
}) => (
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
        onClick={onGenerate}
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
);
