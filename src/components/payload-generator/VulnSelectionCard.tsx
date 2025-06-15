
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, AlertTriangle, Shield } from "lucide-react";
import React from "react";
import { advancedVulns } from "./payloadUtils";

interface Props {
  selectedVulnerability: string;
  onSelect: (vulnId: string) => void;
}

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

export const VulnSelectionCard: React.FC<Props> = ({ selectedVulnerability, onSelect }) => (
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
            onClick={() => onSelect(vuln.id)}
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
);
