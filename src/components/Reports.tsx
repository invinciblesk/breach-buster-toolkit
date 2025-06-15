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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [previewReport, setPreviewReport] = useState<typeof reports[0] | null>(null);

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
    // Create a mock PDF blob for demonstration
    const pdfContent = `Security Report: ${reportName}\n\nGenerated on: ${new Date().toLocaleString()}\n\nThis is a sample security assessment report.`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `${reportName} is being downloaded...`,
    });
    console.log(`Downloading report: ${reportName}`);
  };

  const handlePreview = (report: typeof reports[0]) => {
    setPreviewReport(report);
    toast({
      title: "Opening Preview",
      description: `${report.name} preview opened.`,
    });
    console.log(`Previewing report: ${report.name}`);
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

  const ReportPreview = ({ report }: { report: typeof reports[0] }) => {
    const vulnerabilityBreakdown = [
      { severity: 'Critical', count: report.criticalIssues, color: '#ef4444', description: 'Immediate action required' },
      { severity: 'High', count: Math.floor(report.findings * 0.3), color: '#f97316', description: 'Should be addressed soon' },
      { severity: 'Medium', count: Math.floor(report.findings * 0.4), color: '#eab308', description: 'Plan for remediation' },
      { severity: 'Low', count: Math.floor(report.findings * 0.2), color: '#22c55e', description: 'Monitor and address when convenient' },
      { severity: 'Info', count: Math.floor(report.findings * 0.1), color: '#6b7280', description: 'Informational findings' }
    ];

    const mockVulnerabilities = [
      {
        id: 'CVE-2024-0001',
        title: 'SQL Injection in Login Form',
        severity: 'Critical',
        cvss: '9.8',
        description: 'The login form is vulnerable to SQL injection attacks, allowing attackers to bypass authentication.',
        impact: 'Complete system compromise, data exfiltration, unauthorized access',
        recommendation: 'Implement parameterized queries and input validation',
        affected: ['login.php', 'auth.php'],
        evidence: 'Payload: \' OR 1=1-- successfully bypassed authentication'
      },
      {
        id: 'CVE-2024-0002',
        title: 'Cross-Site Scripting (XSS)',
        severity: 'High',
        cvss: '7.4',
        description: 'Reflected XSS vulnerability in search functionality',
        impact: 'Session hijacking, cookie theft, phishing attacks',
        recommendation: 'Implement proper output encoding and Content Security Policy',
        affected: ['search.php'],
        evidence: 'Payload: <script>alert(document.cookie)</script> executed successfully'
      },
      {
        id: 'MISC-2024-001',
        title: 'Weak Password Policy',
        severity: 'Medium',
        cvss: '5.3',
        description: 'Password policy allows weak passwords with minimum 6 characters',
        impact: 'Increased risk of brute force and dictionary attacks',
        recommendation: 'Enforce minimum 12 characters with complexity requirements',
        affected: ['User registration system'],
        evidence: 'Passwords like "123456" and "password" are accepted'
      }
    ];

    const networkScanResults = [
      { port: '22/tcp', service: 'SSH', version: 'OpenSSH 7.4', status: 'Open', risk: 'Low' },
      { port: '80/tcp', service: 'HTTP', version: 'Apache 2.4.6', status: 'Open', risk: 'Medium' },
      { port: '443/tcp', service: 'HTTPS', version: 'Apache 2.4.6', status: 'Open', risk: 'Low' },
      { port: '3306/tcp', service: 'MySQL', version: '5.7.44', status: 'Open', risk: 'High' },
      { port: '8080/tcp', service: 'HTTP-Alt', version: 'Jetty 9.4.43', status: 'Open', risk: 'Medium' }
    ];

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white space-y-8">
        {/* Report Header */}
        <div className="border-b border-gray-700 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">{report.name}</h1>
              <p className="text-gray-400">Penetration Testing Report</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Report Date</p>
              <p className="text-lg font-semibold">{report.date}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Assessment Type</p>
              <p className="text-lg font-semibold">{report.type}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Total Findings</p>
              <p className="text-lg font-semibold">{report.findings}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Risk Score</p>
              <p className="text-lg font-semibold text-red-400">8.7/10</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Executive Summary
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300 leading-relaxed mb-4">
              This penetration testing assessment was conducted to evaluate the security posture of the target infrastructure. 
              The assessment identified <span className="text-red-400 font-semibold">{report.criticalIssues} critical vulnerabilities</span> and 
              <span className="text-orange-400 font-semibold"> {report.findings} total findings</span> across the tested systems.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Immediate attention is required for critical vulnerabilities, particularly SQL injection and authentication bypass issues. 
              The overall security posture requires significant improvement to protect against modern cyber threats.
            </p>
          </div>
        </div>

        {/* Vulnerability Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Vulnerability Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
              <div className="space-y-3">
                {vulnerabilityBreakdown.map((vuln) => (
                  <div key={vuln.severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: vuln.color }}
                      />
                      <span className="font-medium">{vuln.severity}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{vuln.count}</span>
                      <p className="text-xs text-gray-400">{vuln.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Overall Risk</span>
                    <span className="text-red-400 font-semibold">High</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Remediation Priority</span>
                    <span className="text-orange-400 font-semibold">Urgent</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Business Impact</span>
                    <span className="text-red-400 font-semibold">Critical</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400">Detailed Findings</h2>
          <div className="space-y-6">
            {mockVulnerabilities.map((vuln, index) => (
              <div key={vuln.id} className="bg-gray-800 p-6 rounded-lg border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{vuln.title}</h3>
                    <p className="text-sm text-gray-400">{vuln.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${vuln.severity === 'Critical' ? 'bg-red-600' : vuln.severity === 'High' ? 'bg-orange-600' : 'bg-yellow-600'}`}>
                      {vuln.severity}
                    </Badge>
                    <p className="text-sm text-gray-400 mt-1">CVSS: {vuln.cvss}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-green-400">Description</h4>
                      <p className="text-gray-300">{vuln.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">Impact</h4>
                      <p className="text-gray-300">{vuln.impact}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-green-400">Recommendation</h4>
                      <p className="text-gray-300">{vuln.recommendation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">Affected Components</h4>
                      <ul className="text-gray-300">
                        {vuln.affected.map((item, i) => (
                          <li key={i} className="text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-900 rounded">
                  <h4 className="font-semibold text-green-400 mb-2">Evidence</h4>
                  <code className="text-sm text-yellow-300">{vuln.evidence}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Scan Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400">Network Scan Results</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-3">Port</th>
                  <th className="text-left p-3">Service</th>
                  <th className="text-left p-3">Version</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {networkScanResults.map((result, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-3 font-mono">{result.port}</td>
                    <td className="p-3">{result.service}</td>
                    <td className="p-3 text-gray-400">{result.version}</td>
                    <td className="p-3">
                      <Badge className={result.status === 'Open' ? 'bg-green-600' : 'bg-red-600'}>
                        {result.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={
                        result.risk === 'High' ? 'bg-red-600' : 
                        result.risk === 'Medium' ? 'bg-orange-600' : 'bg-green-600'
                      }>
                        {result.risk}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400">Remediation Roadmap</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">Immediate Actions (0-7 days)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Patch SQL injection vulnerabilities in authentication system</li>
                  <li>• Implement Web Application Firewall (WAF) as temporary protection</li>
                  <li>• Disable unnecessary services and close unused ports</li>
                  <li>• Enable logging and monitoring for suspicious activities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Short Term (1-4 weeks)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Implement comprehensive input validation and output encoding</li>
                  <li>• Deploy Content Security Policy (CSP) headers</li>
                  <li>• Conduct security code review for all web applications</li>
                  <li>• Implement multi-factor authentication (MFA)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Long Term (1-3 months)</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Establish secure software development lifecycle (SDLC)</li>
                  <li>• Implement regular security testing and code reviews</li>
                  <li>• Deploy endpoint detection and response (EDR) solutions</li>
                  <li>• Conduct security awareness training for development team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Conclusion</h2>
          <p className="text-gray-300 leading-relaxed">
            This penetration testing assessment has identified significant security vulnerabilities that require immediate attention. 
            The presence of critical SQL injection vulnerabilities and weak authentication mechanisms poses substantial risk to the organization. 
            Following the recommended remediation roadmap will significantly improve the security posture and reduce the attack surface.
          </p>
        </div>
      </div>
    );
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
                      {report.status === 'completed' && report.reviewed && (
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handlePreview(report)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-600"
                          title="Preview Report"
                        >
                          <Eye size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Report Preview</DialogTitle>
                        </DialogHeader>
                        {previewReport && <ReportPreview report={previewReport} />}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownload(report.name)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      title="Download Report"
                    >
                      <Download size={14} />
                    </Button>
                    {report.status === 'completed' && !report.reviewed && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkComplete(report.id, report.name)}
                        className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle size={14} />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteReport(report.id, report.name)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      title="Delete Report"
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
