
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Shield, Bug, Search, Terminal, AlertTriangle, FileText, RotateCcw, CheckCircle } from "lucide-react";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

export const Dashboard = ({ setActiveSection }: DashboardProps) => {
  const [testingProgress, setTestingProgress] = useState(72);

  const vulnerabilityData = [
    { name: "Critical", value: 2, color: "#dc2626", count: 2 },
    { name: "High", value: 8, color: "#ea580c", count: 8 },
    { name: "Medium", value: 18, color: "#7c3aed", count: 18 },
    { name: "Low", value: 12, color: "#0ea5e9", count: 12 },
    { name: "Info", value: 4, color: "#10b981", count: 4 },
  ];

  const classificationData = [
    { name: "0 Day", count: 0 },
    { name: "Easily Exploitable", count: 13 },
    { name: "OWASP Top 10", count: 7 },
    { name: "CWE Top 25", count: 5 },
  ];

  const testCasesData = [
    { status: "Tested", count: 101, color: "#10b981" },
    { status: "In Progress", count: 25, color: "#f59e0b" },
    { status: "Pending", count: 47, color: "#6b7280" },
  ];

  const statusCards = [
    { title: "Open", count: "31", color: "text-red-400", bgColor: "bg-red-900/20", icon: AlertTriangle },
    { title: "Retest", count: "5", color: "text-orange-400", bgColor: "bg-orange-900/20", icon: RotateCcw },
    { title: "Closed", count: "13", color: "text-green-400", bgColor: "bg-green-900/20", icon: CheckCircle },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CyberPen Pro Portal</h1>
          <p className="text-gray-400 mt-1">Projects / CyberPen Pro Portal / Overview</p>
          <p className="text-sm text-gray-500 mt-2">December 15, 2024 - December 22, 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Testing in Progress</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="text-blue-400">Overview</TabsTrigger>
          <TabsTrigger value="tracking" className="text-gray-400">Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className={`bg-gray-800 border-gray-700 ${card.bgColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${card.color.replace('text-', 'bg-')}`}></div>
                          <span className="text-gray-300 text-sm">{card.title}</span>
                        </div>
                        <div className={`text-4xl font-bold ${card.color}`}>{card.count}</div>
                      </div>
                      <Icon className={`h-8 w-8 ${card.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Testing Progress */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block mb-4">
                  Testing
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Testing Progress</span>
                  <span className="text-blue-400 font-semibold">{testingProgress}%</span>
                </div>
                <Progress value={testingProgress} className="h-3 bg-gray-700" />
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vulnerability Priority Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Priority
                  <span className="text-gray-400 text-sm">Vulnerability Count By Priority</span>
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
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {vulnerabilityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-sm">Total</div>
                        <div className="text-white text-2xl font-bold">{totalVulnerabilities}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {vulnerabilityData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-300 text-sm">{item.name}</span>
                        </div>
                        <span className="text-white font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Class</CardTitle>
                <p className="text-gray-400 text-sm">Vulnerability Count By Well Known Class</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classificationData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-white font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Cases */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Test Cases</CardTitle>
                <p className="text-gray-400 text-sm">Test Cases Count By Status</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testCasesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-300">{item.status}</span>
                      </div>
                      <span className="text-white font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Retesting Rounds */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Retesting Rounds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Round 4</span>
                    <Badge className="bg-green-600 text-white">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Generation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Custom Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveSection("reports")}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FileText size={20} />
                    <span>Custom Reports</span>
                  </button>
                  <button 
                    onClick={() => setActiveSection("reports")}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FileText size={20} />
                    <span>Executive Summary</span>
                  </button>
                  <button 
                    onClick={() => setActiveSection("reports")}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FileText size={20} />
                    <span>PDF Report</span>
                  </button>
                  <button 
                    onClick={() => setActiveSection("reports")}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FileText size={20} />
                    <span>DOCX Report</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-gray-400 text-sm">Name</span>
                  <p className="text-white">CyberPen Pro Portal</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Code</span>
                  <p className="text-white">CYBER9999</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
