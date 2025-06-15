
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { NetworkScanner } from "@/components/NetworkScanner";
import { WirelessScanner } from "@/components/WirelessScanner";
import { VulnerabilityAssessment } from "@/components/VulnerabilityAssessment";
import { PayloadGenerator } from "@/components/PayloadGenerator";
import { Reports } from "@/components/Reports";
import { TargetManager } from "@/components/TargetManager";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard setActiveSection={setActiveSection} />;
      case "network-scanner":
        return <NetworkScanner />;
      case "wireless-scanner":
        return <WirelessScanner />;
      case "vulnerability-assessment":
        return <VulnerabilityAssessment />;
      case "payload-generator":
        return <PayloadGenerator />;
      case "reports":
        return <Reports />;
      case "target-manager":
        return <TargetManager />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-900 text-green-400 flex w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          {renderActiveSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
