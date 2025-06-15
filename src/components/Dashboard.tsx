import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Area, AreaChart } from "recharts";
import { Shield, Bug, Search, Terminal, AlertTriangle, FileText, RotateCcw, CheckCircle, TrendingUp, TrendingDown, Activity, Zap, Eye, Clock, Users, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

export const Dashboard = ({ setActiveSection }: DashboardProps) => {
  const [testingProgress, setTestingProgress] = useState(72);
  const [animatedValues, setAnimatedValues] = useState({
    openVulns: 0,
    retestVulns: 0,
    closedVulns: 0,
  });

  // Get current date and calculate project timeline
  const currentDate = new Date();
  const projectStartDate = new Date();
  projectStartDate.setDate(currentDate.getDate() - 7); // Started 7 days ago
  const projectEndDate = new Date();
  projectEndDate.setDate(currentDate.getDate() + 7); // Ends in 7 days

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Animate counters on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        openVulns: 31,
        retestVulns: 5,
        closedVulns: 13,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const vulnerabilityData = [
    { name: "Critical", value: 2, color: "#dc2626", count: 2 },
    { name: "High", value: 8, color: "#ea580c", count: 8 },
    { name: "Medium", value: 18, color: "#7c3aed", count: 18 },
    { name: "Low", value: 12, color: "#0ea5e9", count: 12 },
    { name: "Info", value: 4, color: "#10b981", count: 4 },
  ];

  const trendData = [
    { month: "Jan", vulnerabilities: 45, resolved: 23 },
    { month: "Feb", vulnerabilities: 38, resolved: 31 },
    { month: "Mar", vulnerabilities: 52, resolved: 28 },
    { month: "Apr", vulnerabilities: 44, resolved: 41 },
    { month: "May", vulnerabilities: 31, resolved: 35 },
    { month: "Jun", vulnerabilities: 24, resolved: 28 },
  ];

  const activityData = [
    { time: "00:00", scans: 12, alerts: 3 },
    { time: "04:00", scans: 8, alerts: 1 },
    { time: "08:00", scans: 24, alerts: 7 },
    { time: "12:00", scans: 31, alerts: 12 },
    { time: "16:00", scans: 28, alerts: 8 },
    { time: "20:00", scans: 19, alerts: 4 },
  ];

  const classificationData = [
    { name: "0 Day", count: 0, severity: "critical" },
    { name: "Easily Exploitable", count: 13, severity: "high" },
    { name: "OWASP Top 10", count: 7, severity: "medium" },
    { name: "CWE Top 25", count: 5, severity: "low" },
  ];

  const testCasesData = [
    { status: "Tested", count: 101, color: "#10b981", percentage: 58 },
    { status: "In Progress", count: 25, color: "#f59e0b", percentage: 14 },
    { status: "Pending", count: 47, color: "#6b7280", percentage: 28 },
  ];

  const statusCards = [
    { 
      title: "Open Vulnerabilities", 
      count: animatedValues.openVulns, 
      color: "text-red-400", 
      bgColor: "bg-gradient-to-br from-red-500/10 to-red-600/5", 
      borderColor: "border-red-500/20",
      icon: AlertTriangle,
      trend: "+12%",
      trendUp: false
    },
    { 
      title: "Pending Retest", 
      count: animatedValues.retestVulns, 
      color: "text-orange-400", 
      bgColor: "bg-gradient-to-br from-orange-500/10 to-orange-600/5", 
      borderColor: "border-orange-500/20",
      icon: RotateCcw,
      trend: "-3%",
      trendUp: true
    },
    { 
      title: "Resolved Issues", 
      count: animatedValues.closedVulns, 
      color: "text-green-400", 
      bgColor: "bg-gradient-to-br from-green-500/10 to-green-600/5", 
      borderColor: "border-green-500/20",
      icon: CheckCircle,
      trend: "+28%",
      trendUp: true
    },
  ];

  const quickStats = [
    { label: "Active Scans", value: "7", icon: Activity, color: "text-blue-400" },
    { label: "Total Assets", value: "1,247", icon: Database, color: "text-purple-400" },
    { label: "Team Members", value: "12", icon: Users, color: "text-indigo-400" },
    { label: "Uptime", value: "99.9%", icon: Clock, color: "text-green-400" },
  ];

  const totalVulnerabilities = vulnerabilityData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    critical: { label: "Critical", color: "#dc2626" },
    high: { label: "High", color: "#ea580c" },
    medium: { label: "Medium", color: "#7c3aed" },
    low: { label: "Low", color: "#0ea5e9" },
    info: { label: "Info", color: "#10b981" },
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CyberPro Pro Portal
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Projects / CyberPro Pro Portal / Overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(projectStartDate)} - {formatDate(projectEndDate)}</span>
            <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10">
              <Activity className="w-3 h-3 mr-1" />
              Testing in Progress
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => setActiveSection("reports")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setActiveSection("network-scanner")}
          >
            <Search className="w-4 h-4 mr-2" />
            Start New Scan
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tracking" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusCards.map((card, index) => {
              const Icon = card.icon;
              const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;
              return (
                <Card key={index} className={`${card.bgColor} border ${card.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105 group`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center border ${card.borderColor}`}>
                        <Icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${card.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                        <TrendIcon className="w-4 h-4" />
                        {card.trend}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-300 text-sm font-medium mb-1">{card.title}</h3>
                      <div className={`text-3xl font-bold ${card.color} transition-all duration-1000`}>
                        {card.count}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Testing Progress */}
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">Security Assessment Progress</h3>
                    <p className="text-gray-400 text-sm">Current testing phase completion</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{testingProgress}%</div>
                  <div className="text-gray-400 text-sm">Complete</div>
                </div>
              </div>
              <Progress value={testingProgress} className="h-3 bg-gray-700" />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Started {formatDate(projectStartDate)}</span>
                <span>Est. completion: {formatDate(projectEndDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Vulnerability Priority Chart */}
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    Vulnerability Priority
                  </span>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {totalVulnerabilities} Total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <ChartContainer config={chartConfig} className="h-48 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={vulnerabilityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            dataKey="value"
                            strokeWidth={2}
                          >
                            {vulnerabilityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#1f2937" />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-sm font-medium">Total</div>
                        <div className="text-white text-2xl font-bold">{totalVulnerabilities}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    {vulnerabilityData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-gray-600" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-300 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">{item.count}</span>
                          <div className="w-12 bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-1000" 
                              style={{ 
                                backgroundColor: item.color, 
                                width: `${(item.count / totalVulnerabilities) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerability Trends */}
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Security Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="vulnerabilities" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" className="text-gray-400" />
                      <YAxis className="text-gray-400" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="vulnerabilities"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#vulnerabilities)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#resolved)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classification Analysis */}
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bug className="h-4 w-4 text-white" />
                  </div>
                  Threat Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classificationData.map((item, index) => {
                    const severityColors = {
                      critical: "text-red-400 border-red-500/20 bg-red-500/10",
                      high: "text-orange-400 border-orange-500/20 bg-orange-500/10",
                      medium: "text-purple-400 border-purple-500/20 bg-purple-500/10",
                      low: "text-blue-400 border-blue-500/20 bg-blue-500/10"
                    };
                    return (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${severityColors[item.severity]} hover:scale-105 transition-transform`}>
                        <span className="text-gray-300 font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">{item.count}</span>
                          {item.count > 0 && (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.severity === 'critical' ? 'bg-red-500' : item.severity === 'high' ? 'bg-orange-500' : item.severity === 'medium' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                              {item.count}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Test Cases Progress */}
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Terminal className="h-4 w-4 text-white" />
                  </div>
                  Test Execution Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testCasesData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-gray-600" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-300 font-medium">{item.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">{item.count}</span>
                          <span className="text-gray-400 text-sm">({item.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000" 
                          style={{ 
                            backgroundColor: item.color, 
                            width: `${item.percentage}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Executive Summary", icon: FileText },
                    { name: "Technical Report", icon: Terminal },
                    { name: "Compliance Report", icon: Shield },
                    { name: "Risk Assessment", icon: AlertTriangle }
                  ].map((report, index) => {
                    const Icon = report.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => setActiveSection("reports")}
                        className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200 h-auto p-3 flex flex-col gap-2"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{report.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Project Information */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Project Name</span>
                    <p className="text-white font-medium">CyberPro Pro Portal</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Project Code</span>
                    <p className="text-white font-medium">CYBER9999</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Test Round</span>
                    <Badge className="bg-green-600 text-white">Round 4</Badge>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Status</span>
                    <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/10">
                      Active Testing
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6 mt-6">
          {/* Activity Timeline */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <XAxis dataKey="time" className="text-gray-400" />
                    <YAxis className="text-gray-400" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="scans"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="alerts"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
