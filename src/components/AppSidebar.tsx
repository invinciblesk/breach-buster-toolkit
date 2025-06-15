
import { Shield, Search, Bug, Code, Database, Lock, Wifi, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/UserMenu";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "network-scanner", label: "Network Scanner", icon: Search },
    { id: "wireless-scanner", label: "Wireless Scanner", icon: Wifi },
    { id: "vulnerability-assessment", label: "Vulnerability Assessment", icon: Bug },
    { id: "payload-generator", label: "Payload Generator", icon: Code },
    { id: "target-manager", label: "Target Manager", icon: Database },
    { id: "security-integrations", label: "Security Integrations", icon: Settings },
    { id: "reports", label: "Reports", icon: Lock },
  ];

  return (
    <Sidebar className="bg-slate-900 border-r border-slate-700" collapsible="none">
      <SidebarHeader className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Shield size={32} className="text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold text-white">CyberPro Pro</h1>
            <p className="text-slate-400 text-sm">Pentesting Automation Suite</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 px-2 py-3 text-xs font-semibold uppercase tracking-wider">
            Security Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 hover:bg-slate-800",
                        activeSection === item.id
                          ? "bg-emerald-900/50 text-emerald-400 border-l-4 border-emerald-400"
                          : "text-slate-300 hover:text-white"
                      )}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-slate-700">
        <div className="mb-4">
          <UserMenu />
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-300 font-medium">System Status</span>
          </div>
          <p className="text-xs text-emerald-400">All systems operational</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
