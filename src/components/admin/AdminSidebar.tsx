import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Settings,
  LogOut,
  Store,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const adminItems = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: LayoutDashboard,
    description: "Visão geral"
  },
  { 
    title: "Produtos", 
    url: "/admin/produtos", 
    icon: Package,
    description: "Gerenciar catálogo"
  },
  { 
    title: "Categorias", 
    url: "/admin/categorias", 
    icon: Tag,
    description: "Organizar produtos"
  },
  { 
    title: "Usuários", 
    url: "/admin/usuarios", 
    icon: Users,
    description: "Gerenciar usuários"
  },
  { 
    title: "Relatórios", 
    url: "/admin/relatorios", 
    icon: BarChart3,
    description: "Visualizar estatísticas"
  },
];

export function AdminSidebar() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Store className="h-6 w-6 text-primary" />
          {state === "expanded" && (
            <span className="font-bold text-lg">KAJIM Admin</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {state === "expanded" && user?.email && (
          <div className="px-2 py-2 bg-muted/30 rounded-lg mb-2">
            <div className="text-sm font-medium truncate">{user.email}</div>
            <div className="text-xs text-muted-foreground">Administrador</div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size={state === "collapsed" ? "sm" : "md"}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {state === "expanded" && <span className="ml-2">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}