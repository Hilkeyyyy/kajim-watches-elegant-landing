import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Settings,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Produtos", url: "/admin/produtos", icon: Package },
  { title: "Categorias", url: "/admin/categorias", icon: Tag },
  { title: "Usuários", url: "/admin/usuarios", icon: Users },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className={collapsed ? "w-12 xs:w-14" : "w-56 xs:w-60"}
      collapsible="icon"
    >

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel Administrativo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin"}
                      className={({ isActive }) => getNavCls({ isActive: isActive || (item.url === "/admin" && currentPath === "/admin") })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info and Logout */}
        <div className="mt-auto p-4 border-t">
          {!collapsed && (
            <div className="mb-2 text-sm text-muted-foreground">
              {user?.email}
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "sm" : "default"}
            className={`w-full ${collapsed ? "px-2" : "justify-start"}`}
            onClick={handleSignOut}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}