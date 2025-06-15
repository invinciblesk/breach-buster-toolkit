
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Shield, Activity, Database, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SecurityIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedTool, setSelectedTool] = useState("");
  const [eventType, setEventType] = useState("vulnerability_detected");
  const { toast } = useToast();

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('security_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching integrations:', error);
      } else {
        setIntegrations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('integration_logs')
        .select(`
          *,
          security_tools(name, type)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching logs:', error);
      } else {
        setLogs(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    fetchLogs();
  }, []);

  const handleToggleIntegration = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('security_tools')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) {
        console.error('Error updating integration:', error);
        toast({
          title: "Error",
          description: "Failed to update integration status",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Integration ${isActive ? 'enabled' : 'disabled'}`,
        });
        fetchIntegrations();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTestSiemIntegration = async () => {
    if (!selectedTool) {
      toast({
        title: "Error",
        description: "Please select a SIEM tool to test",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('siem-integration', {
        body: {
          event_type: eventType,
          integration_type: selectedTool,
          vulnerability_data: {
            title: "Test Security Event",
            severity: "medium",
            affected_target: "test.example.com",
            port: 443,
            service: "https",
            description: "This is a test event from CyberPen Pro"
          }
        }
      });

      if (error) {
        console.error('SIEM integration error:', error);
        toast({
          title: "Integration Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Integration Successful",
          description: data.message,
        });
        fetchLogs();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to test SIEM integration",
        variant: "destructive",
      });
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'siem':
      case 'splunk':
        return <Database size={20} />;
      case 'soar':
        return <Zap size={20} />;
      case 'firewall':
        return <Shield size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Security Integrations</h1>
        <p className="text-gray-400 mt-1">Manage SIEM, SOAR, and security tool integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings size={20} />
              Available Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((integration: any) => (
                <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIntegrationIcon(integration.type)}
                    <div>
                      <div className="text-white font-medium">{integration.name}</div>
                      <div className="text-sm text-gray-400 capitalize">{integration.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={integration.is_active ? 'default' : 'secondary'}>
                      {integration.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={integration.is_active}
                      onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity size={20} />
              Test SIEM Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">SIEM Platform</label>
              <Select value={selectedTool} onValueChange={setSelectedTool}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select SIEM tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="splunk">Splunk</SelectItem>
                  <SelectItem value="siem">Generic SIEM</SelectItem>
                  <SelectItem value="soar">SOAR Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vulnerability_detected">Vulnerability Detected</SelectItem>
                  <SelectItem value="pii_exposure">PII Exposure</SelectItem>
                  <SelectItem value="scan_completed">Scan Completed</SelectItem>
                  <SelectItem value="security_alert">Security Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleTestSiemIntegration}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!selectedTool}
            >
              Test Integration
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Integration Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log: any, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{log.security_tools?.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.event_type}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  Type: {log.security_tools?.type} | Event: {log.event_type}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
