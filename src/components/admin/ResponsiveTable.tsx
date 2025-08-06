import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MoreHorizontal, Eye, Edit, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  status: string;
  stock_quantity: number;
  stock_status: string;
  badges?: string[];
  is_visible: boolean;
  is_featured: boolean;
}

interface ResponsiveTableProps {
  products: Product[];
  onDeleteClick: (product: Product) => void;
  formatPrice: (price: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  getStockBadge: (stockStatus: string, quantity: number) => React.ReactNode;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  products,
  onDeleteClick,
  formatPrice,
  getStatusBadge,
  getStockBadge,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-start space-x-3">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-16 w-16 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 bg-muted rounded flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(product.status)}
                    {getStockBadge(product.stock_status, product.stock_quantity)}
                    {product.is_featured && (
                      <Badge variant="secondary" className="text-xs">⭐ Destaque</Badge>
                    )}
                    {!product.is_visible && (
                      <Badge variant="outline" className="text-xs">Oculto</Badge>
                    )}
                  </div>
                  
                  {product.badges && product.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.badges.slice(0, 3).map((badge, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                      {product.badges.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.badges.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    Estoque: {product.stock_quantity}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/produtos/editar/${product.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteClick(product)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Produto</TableHead>
            <TableHead className="min-w-[120px]">Marca</TableHead>
            <TableHead className="min-w-[100px]">Preço</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[120px]">Estoque</TableHead>
            <TableHead className="min-w-[150px]">Badges</TableHead>
            <TableHead className="text-right min-w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.is_featured && "⭐ Destaque • "}
                      {product.is_visible ? "Visível" : "Oculto"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.brand}</TableCell>
              <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
              <TableCell>{getStatusBadge(product.status)}</TableCell>
              <TableCell>
                {getStockBadge(product.stock_status, product.stock_quantity)}
                <div className="text-sm text-muted-foreground mt-1">
                  Qtd: {product.stock_quantity}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {product.badges?.slice(0, 2).map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                  {product.badges && product.badges.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.badges.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/produtos/editar/${product.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteClick(product)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponsiveTable;