
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { NetworkScanner } from "@/components/NetworkScanner";
import { VulnerabilityAssessment } from "@/components/VulnerabilityAssessment";
import { PayloadGenerator } from "@/components/PayloadGenerator";
import { Reports } from "@/components/Reports";
import { TargetManager } from "@/components/TargetManager";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "network-scanner":
        return <NetworkScanner />;
      case "vulnerability-assessment":
        return <VulnerabilityAssessment />;
      case "payload-generator":
        return <PayloadGenerator />;
      case "reports":
        return <Reports />;
      case "target-manager":
        return <TargetManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-6">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default Index;
