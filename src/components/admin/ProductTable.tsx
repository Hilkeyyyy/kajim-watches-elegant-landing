import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, Trash2, Star, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  status: string;
  stock_quantity: number;
  is_featured: boolean;
  is_visible: boolean;
  image_url?: string;
}

interface ProductTableProps {
  products: Product[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      out_of_stock: 'outline',
      discontinued: 'outline'
    } as const;

    const label =
      status === 'active'
        ? 'Ativo'
        : status === 'inactive'
        ? 'Inativo'
        : status === 'out_of_stock'
        ? 'Sem estoque'
        : 'Descontinuado';

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {label}
      </Badge>
    );
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="outline" className="text-red-600 border-red-200">Sem estoque</Badge>;
    }
    if (quantity < 10) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Estoque baixo</Badge>;
    }
    return <Badge variant="outline" className="text-green-600 border-green-200">Em estoque</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando produtos...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produtos ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Imagem</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{product.name}</p>
                        {product.is_featured && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                        {!product.is_visible && (
                          <Badge variant="outline" className="text-xs">Oculto</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const priceNum = typeof product.price === 'number' ? product.price : Number(product.price ?? 0);
                      return <span className="font-medium">R$ {priceNum.toFixed(2)}</span>;
                    })()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{product.stock_quantity}</div>
                      {getStockBadge(product.stock_quantity)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(product.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};