
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Bug, Search, Terminal } from "lucide-react";

export const Dashboard = () => {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "Active Scans", value: "3", icon: Search, color: "text-blue-400" },
    { title: "Vulnerabilities Found", value: "12", icon: Bug, color: "text-red-400" },
    { title: "Targets Monitored", value: "8", icon: Shield, color: "text-green-400" },
    { title: "Reports Generated", value: "24", icon: Terminal, color: "text-orange-400" },
  ];

  const recentActivity = [
    { action: "Port scan completed", target: "192.168.1.100", time: "2 minutes ago", status: "success" },
    { action: "Vulnerability detected", target: "web-server-01", time: "5 minutes ago", status: "warning" },
    { action: "Payload generated", target: "SQL injection test", time: "8 minutes ago", status: "info" },
    { action: "Report exported", target: "Monthly assessment", time: "12 minutes ago", status: "success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your pentesting operations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Live monitoring active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Scan Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Network Discovery</span>
                <span className="text-green-400">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-gray-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Port Scanning</span>
                <span className="text-blue-400">67%</span>
              </div>
              <Progress value={67} className="h-2 bg-gray-700" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Vulnerability Assessment</span>
                <span className="text-orange-400">23%</span>
              </div>
              <Progress value={23} className="h-2 bg-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.target}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={activity.status === "success" ? "default" : activity.status === "warning" ? "destructive" : "secondary"}
                      className="mb-1"
                    >
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
