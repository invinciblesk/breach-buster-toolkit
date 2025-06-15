import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, Lock, Eye, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [reportToPreview, setReportToPreview] = useState<Report | null>(null);
  const { toast } = useToast();

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
      title: "Report Reviewed",
      description: `Report has been marked as completed.`,
    });
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
          <CardTitle className="text-white">Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-gray-400" />
                    <div>
                      <h3 className="text-white font-medium">{report.name}</h3>
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
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewReport(report)}
                          className="text-white border-gray-500 hover:bg-gray-600 hover:text-white"
                        >
                          <Eye size={14} className="mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReviewReport(report.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          Review
                        </Button>
                      </>
                    )}
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
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-gray-400 text-xs">Generated this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">20</div>
            <p className="text-gray-400 text-xs">Ready for download</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">3</div>
            <p className="text-gray-400 text-xs">Currently generating</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">1</div>
            <p className="text-gray-400 text-xs">Pending review</p>
          </CardContent>
        </Card>
      </div>
      
      {reportToPreview && (
        <Dialog open={!!reportToPreview} onOpenChange={(isOpen) => !isOpen && setReportToPreview(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl">
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

              <div>
                <h3 className="font-semibold text-xl mb-3 text-white border-b border-gray-700 pb-2">Vulnerability Findings</h3>
                {reportToPreview.vulnerabilities > 0 ? (
                  <div className="space-y-4 mt-4">
                    {Array.from({ length: reportToPreview.vulnerabilities }).map((_, index) => {
                        const severities = ["High", "Medium", "Low"];
                        const severity = severities[index % 3]; // Cycle through severities for variety
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
