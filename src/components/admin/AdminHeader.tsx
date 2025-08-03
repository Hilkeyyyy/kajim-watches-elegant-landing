import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const getPageInfo = (pathname: string) => {
  const routes: Record<string, { title: string; subtitle: string; breadcrumb: string[] }> = {
    '/admin': {
      title: 'Dashboard',
      subtitle: 'Visão geral do sistema',
      breadcrumb: ['Admin', 'Dashboard']
    },
    '/admin/produtos': {
      title: 'Produtos',
      subtitle: 'Gerenciar catálogo de produtos',
      breadcrumb: ['Admin', 'Produtos']
    },
    '/admin/categorias': {
      title: 'Categorias',
      subtitle: 'Organizar produtos por categoria',
      breadcrumb: ['Admin', 'Categorias']
    },
    '/admin/usuarios': {
      title: 'Usuários',
      subtitle: 'Gerenciar usuários do sistema',
      breadcrumb: ['Admin', 'Usuários']
    },
    '/admin/configuracoes': {
      title: 'Configurações',
      subtitle: 'Configurações do sistema',
      breadcrumb: ['Admin', 'Configurações']
    },
  };

  return routes[pathname] || {
    title: 'Admin',
    subtitle: 'Painel administrativo',
    breadcrumb: ['Admin']
  };
};

export function AdminHeader() {
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {pageInfo.breadcrumb.map((item, index) => (
            <React.Fragment key={item}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === pageInfo.breadcrumb.length - 1 ? (
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="/admin">{item}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="ml-4 flex-1">
        <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
        <p className="text-sm text-muted-foreground">{pageInfo.subtitle}</p>
      </div>
    </header>
  );
}