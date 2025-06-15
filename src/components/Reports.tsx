import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const Reports = () => {
  const [reports] = useState([
    {
      id: 1,
      name: "Network Security Assessment",
      type: "Network Scan",
      date: "2024-01-15",
      status: "completed",
      findings: 23,
      criticalIssues: 5,
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Web Application Security Test",
      type: "Web App Scan",
      date: "2024-01-14",
      status: "completed",
      findings: 18,
      criticalIssues: 3,
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Wireless Network Analysis",
      type: "Wireless Scan",
      date: "2024-01-13",
      status: "in-progress",
      findings: 12,
      criticalIssues: 2,
      size: "1.2 MB"
    }
  ]);

  const vulnerabilityData = [
    { name: 'Critical', value: 15, color: '#ef4444' },
    { name: 'High', value: 28, color: '#f97316' },
    { name: 'Medium', value: 45, color: '#eab308' },
    { name: 'Low', value: 32, color: '#22c55e' },
    { name: 'Info', value: 18, color: '#6b7280' }
  ];

  const monthlyTrendData = [
    { month: 'Sep', vulnerabilities: 45, resolved: 38 },
    { month: 'Oct', vulnerabilities: 52, resolved: 41 },
    { month: 'Nov', vulnerabilities: 38, resolved: 45 },
    { month: 'Dec', vulnerabilities: 61, resolved: 52 },
    { month: 'Jan', vulnerabilities: 42, resolved: 38 }
  ];

  const severityTrendData = [
    { month: 'Sep', critical: 8, high: 15, medium: 22 },
    { month: 'Oct', critical: 12, high: 18, medium: 22 },
    { month: 'Nov', critical: 6, high: 14, medium: 18 },
    { month: 'Dec', critical: 15, high: 21, medium: 25 },
    { month: 'Jan', critical: 9, high: 16, medium: 17 }
  ];

  const { toast } = useToast();

  const handleDownload = (reportName: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportName} is being downloaded...`,
    });
    console.log(`Downloading report: ${reportName}`);
  };

  const handleGenerate = () => {
    toast({
      title: "Generating Report",
      description: "New security assessment report is being generated...",
    });
    console.log("Generating new report");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "in-progress": return "bg-blue-600";
      case "failed": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-gray-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Scans</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">2 network, 1 web app</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">15</div>
            <p className="text-xs text-gray-400">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">89%</div>
            <p className="text-xs text-gray-400">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 size={20} />
              Vulnerability Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vulnerabilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp size={20} />
              Monthly Vulnerability Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="vulnerabilities" fill="#ef4444" name="Found" />
                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Severity Trends */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle size={20} />
            Severity Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={severityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" name="Critical" />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" name="High" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="#eab308" name="Medium" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Generate New Report */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Generate New Report</span>
            <Button onClick={handleGenerate} className="bg-green-600 hover:bg-green-700">
              <FileText size={16} className="mr-2" />
              Generate Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Create a comprehensive security assessment report based on recent scans and findings.
          </p>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={18} className="text-blue-400" />
                    <h3 className="text-white font-medium">{report.name}</h3>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {report.date}
                    </span>
                    <span>{report.type}</span>
                    <span>{report.findings} findings</span>
                    <span className="text-red-400">{report.criticalIssues} critical</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload(report.name)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
