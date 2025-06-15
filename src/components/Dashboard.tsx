
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Wifi, 
  Bug, 
  Code,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

export const Dashboard = ({ setActiveSection }: DashboardProps) => {
  // Calculate dynamic date range (current week)
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // End of current week (Saturday)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const quickActions = [
    {
      title: "Network Scanner",
      description: "Scan network infrastructure for vulnerabilities",
      icon: Search,
      action: () => setActiveSection("network-scanner"),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Wireless Scanner", 
      description: "Analyze wireless networks and access points",
      icon: Wifi,
      action: () => setActiveSection("wireless-scanner"),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Vulnerability Assessment",
      description: "Perform comprehensive security assessments", 
      icon: Bug,
      action: () => setActiveSection("vulnerability-assessment"),
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Payload Generator",
      description: "Generate custom exploitation payloads",
      icon: Code,
      action: () => setActiveSection("payload-generator"),
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "scan",
      message: "Network scan completed for 192.168.1.0/24",
      timestamp: "5 minutes ago",
      status: "success"
    },
    {
      id: 2,
      type: "vulnerability",
      message: "High severity vulnerability detected in web server",
      timestamp: "12 minutes ago", 
      status: "warning"
    },
    {
      id: 3,
      type: "report",
      message: "Security assessment report generated",
      timestamp: "1 hour ago",
      status: "info"
    },
    {
      id: 4,
      type: "scan",
      message: "Wireless network scan initiated",
      timestamp: "2 hours ago",
      status: "in-progress"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "scan": return Search;
      case "vulnerability": return AlertTriangle;
      case "report": return Shield;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "error": return "text-red-400";
      case "in-progress": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb and date range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center text-sm text-gray-400 mb-1">
            <span>Projects</span>
            <span className="mx-2">/</span>
            <span>CyberPro Pro Portal</span>
            <span className="mx-2">/</span>
            <span className="text-green-400">Overview</span>
          </div>
          <p className="text-gray-500 text-sm">
            {formatDate(weekStart)} - {formatDate(weekEnd)}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Scans</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-gray-400">5 critical, 12 high</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Targets</CardTitle>
            <Shield className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-gray-400">18 active, 5 offline</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94%</div>
            <p className="text-xs text-gray-400">+1.2% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} p-4 h-auto flex flex-col items-center gap-3 text-center min-h-[120px] group transition-all duration-200`}
                  variant="default"
                >
                  <Icon size={28} className="flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="font-semibold text-sm leading-tight">{action.title}</div>
                    <div className="text-xs opacity-90 leading-tight line-clamp-2">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp size={20} />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">CPU Usage</span>
                <span className="text-green-400">23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Memory Usage</span>
                <span className="text-yellow-400">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Active Connections</span>
                <span className="text-blue-400">156</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock size={20} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Icon size={16} className={`mt-1 ${getStatusColor(activity.status)}`} />
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{activity.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield size={20} />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">5</div>
              <div className="text-sm text-gray-300">Critical Issues</div>
              <Badge variant="destructive" className="mt-2">Immediate Action Required</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">12</div>
              <div className="text-sm text-gray-300">High Priority</div>
              <Badge variant="secondary" className="mt-2 bg-orange-600">Review Needed</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">94%</div>
              <div className="text-sm text-gray-300">Security Score</div>
              <Badge variant="secondary" className="mt-2 bg-green-600">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
