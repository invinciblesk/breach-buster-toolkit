import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, Lock, Eye, ShieldCheck, Trash2, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

const initialReports = [
  {
    id: 1,
    name: "Q1 2024 Security Assessment",
    type: "Comprehensive",
    date: "2024-01-15",
    status: "completed",
    vulnerabilities: 12,
    targets: 5
  },
  {
    id: 2,
    name: "Web Application Pentest",
    type: "Web Security",
    date: "2024-01-10",
    status: "completed",
    vulnerabilities: 8,
    targets: 2
  },
  {
    id: 3,
    name: "Network Infrastructure Scan",
    type: "Network Security",
    date: "2024-01-08",
    status: "completed",
    vulnerabilities: 15,
    targets: 10
  },
  {
    id: 4,
    name: "Monthly Security Review",
    type: "Executive Summary",
    date: "2024-01-05",
    status: "draft",
    vulnerabilities: 20,
    targets: 8
  }
];

const reportTypeOptions = [
    { value: "comprehensive", label: "Comprehensive Security Assessment", typeName: "Comprehensive" },
    { value: "web-security", label: "Web Application Security", typeName: "Web Security" },
    { value: "network-security", label: "Network Security Assessment", typeName: "Network Security" },
    { value: "executive-summary", label: "Executive Summary", typeName: "Executive Summary" },
    { value: "compliance", label: "Compliance Report", typeName: "Compliance" }
];

type Report = typeof initialReports[number];

const chartConfig = {
  high: {
    label: "High",
    color: "#dc2626",
  },
  medium: {
    label: "Medium", 
    color: "#ea580c",
  },
  low: {
    label: "Low",
    color: "#ca8a04",
  },
  info: {
    label: "Info",
    color: "#2563eb",
  },
};

export const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [reportToPreview, setReportToPreview] = useState<Report | null>(null);
  const { toast } = useToast();
  const [selectedReports, setSelectedReports] = useState<Set<number>>(new Set());
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'selected' | 'all' | null>(null);
  const [singleReportToDelete, setSingleReportToDelete] = useState<Report | null>(null);

  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'completed').length;
  const inProgressReports = reports.filter(r => r.status === 'processing').length;
  const draftReports = reports.filter(r => r.status === 'draft').length;

  // Generate mock vulnerability severity data for charts
  const generateVulnerabilityData = (vulnerabilityCount: number) => {
    const severityDistribution = [
      { name: "High", value: Math.floor(vulnerabilityCount * 0.2), fill: "#dc2626" },
      { name: "Medium", value: Math.floor(vulnerabilityCount * 0.4), fill: "#ea580c" },
      { name: "Low", value: Math.floor(vulnerabilityCount * 0.3), fill: "#ca8a04" },
      { name: "Info", value: Math.floor(vulnerabilityCount * 0.1), fill: "#2563eb" },
    ];
    
    return severityDistribution.filter(item => item.value > 0);
  };

  // Generate mock trend data
  const generateTrendData = () => {
    return [
      { date: "Week 1", vulnerabilities: 8, resolved: 3 },
      { date: "Week 2", vulnerabilities: 12, resolved: 7 },
      { date: "Week 3", vulnerabilities: 15, resolved: 10 },
      { date: "Week 4", vulnerabilities: 10, resolved: 8 },
    ];
  };

  // Generate mock vulnerability types data
  const generateVulnTypesData = (vulnerabilityCount: number) => {
    const types = [
      "SQL Injection",
      "XSS",
      "CSRF", 
      "Directory Traversal",
      "Weak Authentication",
      "Insecure Configuration"
    ];
    
    return types.slice(0, Math.min(6, vulnerabilityCount)).map((type, index) => ({
      type,
      count: Math.floor(Math.random() * 5) + 1,
    }));
  };

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    const selectedReportTypeDetails = reportTypeOptions.find(rt => rt.value === reportType);

    if (!selectedReportTypeDetails) {
        toast({
            title: "Error",
            description: "Invalid report type selected",
            variant: "destructive",
        });
        return;
    }

    const newReport = {
      id: reports.length + 1,
      name: `${selectedReportTypeDetails.typeName} Report - ${new Date().toLocaleDateString()}`,
      type: selectedReportTypeDetails.typeName,
      date: new Date().toISOString().split("T")[0],
      status: "draft",
      vulnerabilities: Math.floor(Math.random() * 25),
      targets: Math.floor(Math.random() * 10) + 1,
    };

    setReports([newReport, ...reports]);
    setReportType("");

    toast({
      title: "Report Generation Started",
      description: `Generating ${selectedReportTypeDetails.label}...`,
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${reportName}...`,
    });
    console.log("Downloading report:", reportName);
  };

  const handlePreviewReport = (report: Report) => {
    setReportToPreview(report);
  };

  const handleReviewReport = (reportId: number) => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, status: "completed" } : report
      )
    );
    toast({
      title: "Report Completed",
      description: `Report has been marked as completed.`,
    });
  };

  const handleToggleSelect = (reportId: number) => {
    setSelectedReports(prev => {
        const newSet = new Set(prev);
        if (newSet.has(reportId)) {
            newSet.delete(reportId);
        } else {
            newSet.add(reportId);
        }
        return newSet;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedReports(new Set(reports.map(r => r.id)));
    } else {
        setSelectedReports(new Set());
    }
  };

  const openDeleteDialog = (target: 'single' | 'selected' | 'all', report?: Report) => {
    setDeleteTarget(target);
    if (report) {
        setSingleReportToDelete(report);
    }
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    let deletedCount = 0;
    let toastTitle = "";
    let toastDescription = "";

    if (deleteTarget === 'single' && singleReportToDelete) {
        setReports(reports.filter((r) => r.id !== singleReportToDelete.id));
        deletedCount = 1;
        toastTitle = "Report Deleted";
        toastDescription = `${singleReportToDelete.name} has been deleted.`;
    } else if (deleteTarget === 'selected') {
        deletedCount = selectedReports.size;
        setReports(reports.filter(r => !selectedReports.has(r.id)));
        setSelectedReports(new Set());
        toastTitle = "Reports Deleted";
        toastDescription = `${deletedCount} reports have been deleted.`;
    } else if (deleteTarget === 'all') {
        deletedCount = reports.length;
        setReports([]);
        setSelectedReports(new Set());
        toastTitle = "Report History Cleared";
        toastDescription = "All reports have been deleted.";
    }

    if(deletedCount > 0){
        toast({
            title: toastTitle,
            description: toastDescription,
        });
    }

    setConfirmDeleteDialogOpen(false);
    setDeleteTarget(null);
    setSingleReportToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "draft": return "bg-orange-600";
      case "processing": return "bg-blue-600";
      default: return "bg-gray-600";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-red-600";
      case "medium": return "bg-orange-600";
      case "low": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "border-red-500";
      case "medium": return "border-orange-500";
      case "low": return "border-yellow-500";
      default: return "border-gray-500";
    }
  };

  const mockVulnerabilityTypes = ["SQL Injection", "Cross-Site Scripting", "Directory Traversal", "Insecure Deserialization", "Command Injection", "Weak Authentication"];

  const allSelected = selectedReports.size === reports.length && reports.length > 0;
  const someSelected = selectedReports.size > 0 && !allSelected;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-gray-400 mt-1">Generate and manage security assessment reports</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText size={20} />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {reportTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-600">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateReport}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                id="select-all"
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={(checked) => handleToggleSelectAll(!!checked)}
                aria-label="Select all reports"
                disabled={reports.length === 0}
              />
              <CardTitle className="text-white">Report History</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {selectedReports.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog('selected')}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Selected ({selectedReports.size})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-500 hover:bg-gray-600 hover:text-white"
                onClick={() => openDeleteDialog('all')}
                disabled={reports.length === 0}
              >
                Clear History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg">
                <Checkbox
                  id={`select-report-${report.id}`}
                  checked={selectedReports.has(report.id)}
                  onCheckedChange={() => handleToggleSelect(report.id)}
                  aria-labelledby={`report-name-${report.id}`}
                  className="mt-1"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-gray-400" />
                      <div>
                        <h3 id={`report-name-${report.id}`} className="text-white font-medium">{report.name}</h3>
                        <p className="text-gray-400 text-sm">{report.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      {report.status === "completed" && (
                        <Button
                          size="sm"
                          onClick={() => handleDownloadReport(report.name)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                      )}
                      {report.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() => handlePreviewReport(report)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          <Eye size={14} className="mr-1" />
                          Review
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => openDeleteDialog('single', report)}
                        className="h-9 w-9"
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Delete report</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-300">{report.date}</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-red-400 font-medium">{report.vulnerabilities}</span> vulnerabilities found
                    </div>
                    <div className="text-gray-300">
                      <span className="text-blue-400 font-medium">{report.targets}</span> targets scanned
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalReports}</div>
            <p className="text-gray-400 text-xs">Generated this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{completedReports}</div>
            <p className="text-gray-400 text-xs">Ready for download</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{inProgressReports}</div>
            <p className="text-gray-400 text-xs">Currently generating</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{draftReports}</div>
            <p className="text-gray-400 text-xs">Pending review</p>
          </CardContent>
        </Card>
      </div>
      
      {reportToPreview && (
        <Dialog open={!!reportToPreview} onOpenChange={(isOpen) => !isOpen && setReportToPreview(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <FileText /> {reportToPreview.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 pt-2">
                Report Type: {reportToPreview.type} | Date: {reportToPreview.date} | Status: <span className="capitalize">{reportToPreview.status}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-8 py-4 max-h-[70vh] overflow-y-auto pr-6">
              <div>
                <h3 className="font-semibold text-xl mb-3 text-white border-b border-gray-700 pb-2">Executive Summary</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  This report details the findings of a {reportToPreview.type} assessment conducted on {reportToPreview.date}. 
                  The automated scan identified <span className="text-red-400 font-medium">{reportToPreview.vulnerabilities}</span> vulnerabilities across <span className="text-blue-400 font-medium">{reportToPreview.targets}</span> scanned targets. 
                  Immediate remediation is recommended for high-risk findings to mitigate potential security threats. This report provides a detailed breakdown of each vulnerability found, along with actionable recommendations.
                </p>
              </div>

              {reportToPreview.vulnerabilities > 0 && (
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Vulnerability Analytics
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Severity Distribution Pie Chart */}
                    <Card className="bg-gray-900/50 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Severity Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={generateVulnerabilityData(reportToPreview.vulnerabilities)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {generateVulnerabilityData(reportToPreview.vulnerabilities).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Vulnerability Types Bar Chart */}
                    <Card className="bg-gray-900/50 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Vulnerability Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={generateVulnTypesData(reportToPreview.vulnerabilities)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis 
                                dataKey="type" 
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="count" fill="#ea580c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Remediation Trend */}
                  <Card className="bg-gray-900/50 border-gray-600 mb-6">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Security Trend Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={generateTrendData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area 
                              type="monotone" 
                              dataKey="vulnerabilities" 
                              stackId="1"
                              stroke="#dc2626" 
                              fill="#dc2626" 
                              fillOpacity={0.6}
                              name="Vulnerabilities Found"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="resolved" 
                              stackId="2"
                              stroke="#16a34a" 
                              fill="#16a34a" 
                              fillOpacity={0.6}
                              name="Vulnerabilities Resolved"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-xl mb-3 text-white border-b border-gray-700 pb-2">Vulnerability Findings</h3>
                {reportToPreview.vulnerabilities > 0 ? (
                  <div className="space-y-4 mt-4">
                    {Array.from({ length: reportToPreview.vulnerabilities }).map((_, index) => {
                        const severities = ["High", "Medium", "Low"];
                        const severity = severities[index % 3];
                        return (
                            <div key={index} className={`p-4 bg-gray-900/50 rounded-lg border-l-4 ${getSeverityBorderColor(severity)}`}>
                                <div className="flex justify-between items-center">
                                    <h4 className="text-white font-medium">
                                        {mockVulnerabilityTypes[Math.floor(Math.random() * mockVulnerabilityTypes.length)]}
                                    </h4>
                                    <Badge className={getSeverityBadgeColor(severity)}>{severity}</Badge>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">
                                    Target: 10.0.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}
                                </p>
                                <p className="text-gray-300 text-sm mt-2">
                                    A potential vulnerability was identified. Automated analysis suggests a risk of unauthorized access or data exposure. Further investigation and patching are required.
                                </p>
                            </div>
                        );
                    })}
                  </div>
                ) : (
                    <div className="text-center py-8 bg-gray-900/50 rounded-lg mt-4">
                        <ShieldCheck size={48} className="mx-auto text-green-500" />
                        <h4 className="mt-4 text-xl font-semibold text-white">No Vulnerabilities Found</h4>
                        <p className="text-gray-400 mt-2">The automated scan did not detect any vulnerabilities for the selected targets.</p>
                    </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-3 text-white border-b border-gray-700 pb-2">Recommendations</h3>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 mt-4">
                    <li>Prioritize remediation for any vulnerabilities classified as 'High' or 'Medium' severity.</li>
                    <li>Review application and server logs for any signs of suspicious activity related to the identified findings.</li>
                    <li>Apply security patches and updates recommended by vendors for all affected software and systems.</li>
                    <li>Conduct follow-up scans after remediation to verify that vulnerabilities have been successfully addressed.</li>
                    <li>Ensure security configurations are hardened according to industry best practices (e.g., CIS Benchmarks).</li>
                </ul>
              </div>
            </div>
            <DialogFooter className="pt-4 sm:justify-start gap-2">
                <Button
                    variant="outline"
                    onClick={() => handleDownloadReport(reportToPreview.name)}
                    className="text-white border-gray-500 hover:bg-gray-600 hover:text-white"
                >
                    <Download size={14} className="mr-1" />
                    Download
                </Button>
                {reportToPreview.status === 'draft' && (
                    <Button
                        onClick={() => {
                            handleReviewReport(reportToPreview.id);
                            setReportToPreview(null);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <ShieldCheck size={14} className="mr-1" />
                        Mark as Completed
                    </Button>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                    {deleteTarget === 'single' && 'This action cannot be undone. This will permanently delete the report.'}
                    {deleteTarget === 'selected' && `This action cannot be undone. This will permanently delete the ${selectedReports.size} selected reports.`}
                    {deleteTarget === 'all' && 'This action cannot be undone. This will permanently delete all reports from history.'}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
