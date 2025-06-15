
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { NetworkScanner } from "@/components/NetworkScanner";
import { WirelessScanner } from "@/components/WirelessScanner";
import { VulnerabilityAssessment } from "@/components/VulnerabilityAssessment";
import { PayloadGenerator } from "@/components/PayloadGenerator";
import { Reports } from "@/components/Reports";
import { TargetManager } from "@/components/TargetManager";
import { SecurityIntegrations } from "@/components/SecurityIntegrations";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show footer when user scrolls to within 100px of the bottom
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowFooter(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      "dashboard": "Dashboard",
      "network-scanner": "Network Scanner",
      "wireless-scanner": "Wireless Scanner",
      "vulnerability-assessment": "Vulnerability Assessment",
      "payload-generator": "Payload Generator",
      "reports": "Reports",
      "target-manager": "Target Manager",
      "security-integrations": "Security Integrations",
    };
    return titles[section] || "Dashboard";
  };

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
      case "security-integrations":
        return <SecurityIntegrations />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gray-900 text-green-400 flex w-full">
        <div className="fixed left-0 top-0 h-screen z-40">
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
        
        <div className="flex-1 flex flex-col ml-64">
          {/* Fixed Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 z-30">
            <h1 className="text-2xl font-bold text-white">{getSectionTitle(activeSection)}</h1>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {renderActiveSection()}
          </main>
          
          {/* Footer - only visible when scrolled to bottom */}
          {showFooter && (
            <div className="transition-opacity duration-300">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
