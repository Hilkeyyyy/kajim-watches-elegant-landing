import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const AdminBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/admin' }
    ];

    if (pathSegments.length > 1) {
      const section = pathSegments[1];
      
      switch (section) {
        case 'produtos':
          items.push({ label: 'Produtos' });
          if (pathSegments[2] === 'criar') {
            items.push({ label: 'Criar Produto' });
          } else if (pathSegments[2] && pathSegments[3] === 'editar') {
            items.push({ label: 'Editar Produto' });
          }
          break;
        case 'categorias':
          items.push({ label: 'Categorias' });
          break;
        case 'usuarios':
          items.push({ label: 'Usuários' });
          break;
        default:
          items.push({ label: section.charAt(0).toUpperCase() + section.slice(1) });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Admin
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href && index < breadcrumbItems.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumb;