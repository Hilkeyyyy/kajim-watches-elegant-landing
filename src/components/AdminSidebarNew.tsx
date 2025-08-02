import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const adminItems = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
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
    title: "Configurações", 
    url: "/admin/configuracoes", 
    icon: Settings,
    description: "Configurações do sistema"
  },
];

export function AdminSidebarNew() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();

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
    <aside 
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">KAJIM Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {adminItems.map((item) => {
          const active = isActive(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                active 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className={cn(
                    "text-xs opacity-70 truncate",
                    active ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <Separator className="mx-3" />

      {/* User Section */}
      <div className="p-3 space-y-3">
        {!collapsed && user?.email && (
          <div className="px-3 py-2 bg-muted/30 rounded-lg">
            <div className="text-sm font-medium truncate">{user.email}</div>
            <div className="text-xs text-muted-foreground">Administrador</div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed && "px-2"
          )}
          onClick={handleSignOut}
        >
          <LogOut className={cn("w-4 h-4", collapsed ? "" : "mr-2")} />
          {!collapsed && "Sair"}
        </Button>
      </div>
    </aside>
  );
}