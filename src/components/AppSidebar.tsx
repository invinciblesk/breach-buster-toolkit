
import { Shield, Search, Bug, Code, Database, Lock, Wifi, Settings, ChevronLeft, ChevronRight } from "lucide-react";
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
  SidebarTrigger,
  useSidebar,
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

  const { state } = useSidebar();

  return (
    <Sidebar className="bg-gray-800 border-r border-gray-700">
      <SidebarHeader className="p-4 pb-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={24} className="text-green-400" />
          {state === "expanded" && (
            <div>
              <h1 className="text-xl font-bold text-green-400 whitespace-nowrap">CyberPro Pro</h1>
              <p className="text-gray-400 text-xs leading-tight mt-0.5">Pentesting Automation Suite</p>
            </div>
          )}
        </div>
        <SidebarTrigger
          className={cn(
            "ml-1 p-1 w-8 h-8 rounded-md border border-green-900 transition-colors bg-gray-900 hover:bg-green-900/20 flex items-center justify-center",
            "text-green-400",
            state === "expanded" ? "hover:text-green-300" : "hover:text-green-500"
          )}
          aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
        >
          {state === "expanded" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">
            {state === "expanded" && "Security Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(item.id)}
                      isActive={activeSection === item.id}
                      tooltip={state === "collapsed" ? item.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                        activeSection === item.id
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : "text-gray-300 hover:bg-gray-700 hover:text-green-400"
                      )}
                    >
                      <Icon size={18} />
                      {state === "expanded" && <span className="text-sm font-medium">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-700">
        {state === "expanded" && (
          <div className="mb-3">
            <UserMenu />
          </div>
        )}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {state === "expanded" && <span className="text-xs text-gray-300">System Status</span>}
          </div>
          {state === "expanded" && <p className="text-xs text-green-400">All systems operational</p>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
