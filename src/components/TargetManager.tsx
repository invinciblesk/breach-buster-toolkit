
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Plus, Search, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TargetManager = () => {
  const [targets, setTargets] = useState([
    {
      id: 1,
      name: "Web Server",
      ip: "192.168.1.100",
      domain: "web-server.local",
      status: "active",
      services: ["HTTP", "HTTPS", "SSH"],
      lastScan: "2024-01-15 14:30",
      riskLevel: "medium"
    },
    {
      id: 2,
      name: "Database Server",
      ip: "192.168.1.101",
      domain: "db-server.local",
      status: "active",
      services: ["MySQL", "PostgreSQL"],
      lastScan: "2024-01-15 12:15",
      riskLevel: "high"
    },
    {
      id: 3,
      name: "Mail Server",
      ip: "192.168.1.102",
      domain: "mail.company.com",
      status: "inactive",
      services: ["SMTP", "IMAP", "POP3"],
      lastScan: "2024-01-14 09:45",
      riskLevel: "low"
    }
  ]);

  const [newTarget, setNewTarget] = useState({
    name: "",
    ip: "",
    domain: ""
  });

  const { toast } = useToast();

  const handleAddTarget = () => {
    if (!newTarget.name || !newTarget.ip) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Name and IP)",
        variant: "destructive",
      });
      return;
    }

    const target = {
      id: targets.length + 1,
      ...newTarget,
      status: "active",
      services: [],
      lastScan: "Never",
      riskLevel: "unknown"
    };

    setTargets([...targets, target]);
    setNewTarget({ name: "", ip: "", domain: "" });
    
    toast({
      title: "Success",
      description: "Target added successfully",
    });

    console.log("Added new target:", target);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-600";
      case "inactive": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-600";
      case "medium": return "bg-orange-600";
      case "low": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Target Manager</h1>
          <p className="text-gray-400 mt-1">Manage and organize your testing targets</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus size={16} className="mr-2" />
              Add Target
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New Target</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                <Input
                  value={newTarget.name}
                  onChange={(e) => setNewTarget({ ...newTarget, name: e.target.value })}
                  placeholder="Target name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">IP Address *</label>
                <Input
                  value={newTarget.ip}
                  onChange={(e) => setNewTarget({ ...newTarget, ip: e.target.value })}
                  placeholder="192.168.1.100"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domain (Optional)</label>
                <Input
                  value={newTarget.domain}
                  onChange={(e) => setNewTarget({ ...newTarget, domain: e.target.value })}
                  placeholder="example.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button onClick={handleAddTarget} className="w-full bg-green-600 hover:bg-green-700">
                Add Target
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((target) => (
          <Card key={target.id} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={18} />
                  {target.name}
                </div>
                <Badge className={getStatusColor(target.status)}>
                  {target.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">IP Address</p>
                <p className="text-white font-mono">{target.ip}</p>
              </div>
              
              {target.domain && (
                <div>
                  <p className="text-gray-400 text-sm">Domain</p>
                  <p className="text-white">{target.domain}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm">Risk Level</p>
                <Badge className={getRiskColor(target.riskLevel)}>
                  {target.riskLevel.toUpperCase()}
                </Badge>
              </div>

              {target.services.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Services</p>
                  <div className="flex flex-wrap gap-1">
                    {target.services.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm">Last Scan</p>
                <p className="text-white text-sm">{target.lastScan}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                  <Search size={14} className="mr-1" />
                  Scan
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Shield size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
