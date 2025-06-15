import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Download, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  BarChart3,
  Trash2,
  RefreshCw,
  Eye
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
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Network Security Assessment",
      type: "Network Scan",
      date: "2024-01-15",
      status: "completed",
      findings: 23,
      criticalIssues: 5,
      size: "2.4 MB",
      reviewed: false
    },
    {
      id: 2,
      name: "Web Application Security Test",
      type: "Web App Scan",
      date: "2024-01-14",
      status: "completed",
      findings: 18,
      criticalIssues: 3,
      size: "1.8 MB",
      reviewed: true
    },
    {
      id: 3,
      name: "Wireless Network Analysis",
      type: "Wireless Scan",
      date: "2024-01-13",
      status: "in-progress",
      findings: 12,
      criticalIssues: 2,
      size: "1.2 MB",
      reviewed: false
    }
  ]);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Calculate dynamic totals based on actual reports data
  const totalReports = reports.length;
  const activeScans = reports.filter(r => r.status === 'in-progress').length;
  const totalCriticalIssues = reports.reduce((sum, report) => sum + report.criticalIssues, 0);
  const completedReports = reports.filter(r => r.status === 'completed').length;
  const resolutionRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;

  const handleDownload = (reportName: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportName} is being downloaded...`,
    });
    console.log(`Downloading report: ${reportName}`);
  };

  const handlePreview = (reportName: string) => {
    toast({
      title: "Opening Preview",
      description: `${reportName} is being opened for preview...`,
    });
    console.log(`Previewing report: ${reportName}`);
  };

  const handleMarkComplete = (reportId: number, reportName: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, reviewed: true }
        : report
    ));
    
    toast({
      title: "Report Marked Complete",
      description: `${reportName} has been marked as reviewed.`,
    });
    console.log(`Marking report ${reportId} as complete`);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    toast({
      title: "Generating Report",
      description: "New security assessment report is being generated...",
    });
    console.log("Generating new report");

    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: reports.length + 1,
        name: `Security Assessment Report ${new Date().toLocaleDateString()}`,
        type: "Comprehensive Scan",
        date: new Date().toISOString().split('T')[0],
        status: "completed" as const,
        findings: Math.floor(Math.random() * 30) + 10,
        criticalIssues: Math.floor(Math.random() * 8) + 1,
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        reviewed: false
      };
      
      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      
      toast({
        title: "Report Generated",
        description: `${newReport.name} has been generated successfully.`,
      });
    }, 3000);
  };

  const handleDeleteReport = (reportId: number, reportName: string) => {
    // Simulate backend deletion
    console.log(`Deleting report with ID: ${reportId} from backend`);
    
    setReports(prev => prev.filter(report => report.id !== reportId));
    setSelectedReports(prev => prev.filter(id => id !== reportId));
    
    toast({
      title: "Report Deleted",
      description: `${reportName} has been deleted.`,
    });
  };

  const handleMultiDelete = () => {
    if (selectedReports.length === 0) return;

    // Simulate backend deletion for selected reports
    console.log(`Deleting reports with IDs: ${selectedReports.join(', ')} from backend`);
    
    const deletedCount = selectedReports.length;
    setReports(prev => prev.filter(report => !selectedReports.includes(report.id)));
    setSelectedReports([]);
    
    toast({
      title: "Reports Deleted",
      description: `${deletedCount} report(s) have been deleted.`,
    });
  };

  const handleClearHistory = () => {
    // Simulate backend deletion of all reports
    console.log("Clearing all reports from backend");
    
    setReports([]);
    setSelectedReports([]);
    
    toast({
      title: "History Cleared",
      description: "All reports have been cleared from history.",
    });
  };

  const handleSelectReport = (reportId: number, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportId]);
    } else {
      setSelectedReports(prev => prev.filter(id => id !== reportId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
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
      {/* Overview Cards - Now Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalReports}</div>
            <p className="text-xs text-gray-400">Generated reports</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Scans</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeScans}</div>
            <p className="text-xs text-gray-400">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalCriticalIssues}</div>
            <p className="text-xs text-gray-400">Across all reports</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{resolutionRate}%</div>
            <p className="text-xs text-gray-400">Reports completed</p>
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
                <Bar dataKey="resolved" fill="##22c55e" name="Resolved" />
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
          <CardTitle className="text-white">Generate New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Create a comprehensive security assessment report based on recent scans and findings.
            </p>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={16} className="mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
          {isGenerating && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Generating report...</span>
                <span>Please wait</span>
              </div>
              <Progress value={33} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Reports</CardTitle>
            <div className="flex gap-2">
              {selectedReports.length > 0 && (
                <Button 
                  onClick={handleMultiDelete} 
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Selected ({selectedReports.length})
                </Button>
              )}
              {reports.length > 0 && (
                <Button 
                  onClick={handleClearHistory} 
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear History
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No reports generated yet. Click "Generate Report" to create your first report.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All Checkbox */}
              {reports.length > 0 && (
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Checkbox
                    checked={selectedReports.length === reports.length}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    className="border-gray-500"
                  />
                  <span className="text-sm text-gray-400">
                    Select All ({reports.length} reports)
                  </span>
                </div>
              )}
              
              {reports.map((report) => (
                <div key={report.id} className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg">
                  <Checkbox
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={(checked) => handleSelectReport(report.id, checked === true)}
                    className="border-gray-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText size={18} className="text-blue-400" />
                      <h3 className="text-white font-medium">{report.name}</h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      {report.reviewed && (
                        <Badge className="bg-green-600">
                          Reviewed
                        </Badge>
                      )}
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
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handlePreview(report.name)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Eye size={14} className="mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownload(report.name)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                    {!report.reviewed && report.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkComplete(report.id, report.name)}
                        className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Mark Complete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteReport(report.id, report.name)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
