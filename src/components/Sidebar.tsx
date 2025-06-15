
import { Shield, Search, Bug, Code, Database, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "network-scanner", label: "Network Scanner", icon: Search },
    { id: "vulnerability-assessment", label: "Vulnerability Assessment", icon: Bug },
    { id: "payload-generator", label: "Payload Generator", icon: Code },
    { id: "target-manager", label: "Target Manager", icon: Database },
    { id: "reports", label: "Reports", icon: Lock },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-green-400 flex items-center gap-2">
          <Shield size={24} />
          CyberPen Pro
        </h1>
        <p className="text-gray-400 text-sm mt-1">Pentesting Automation Suite</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                    activeSection === item.id
                      ? "bg-green-900/30 text-green-400 border border-green-800"
                      : "text-gray-300 hover:bg-gray-700 hover:text-green-400"
                  )}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">System Status</span>
          </div>
          <p className="text-xs text-green-400">All systems operational</p>
        </div>
      </div>
    </div>
  );
};
