import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useErrorHandler } from '@/hooks/useErrorHandler';

import { Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useIsMobile } from '@/hooks/use-mobile';
import ResponsiveTable from '@/components/admin/ResponsiveTable';

const Products = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { products, loadingProducts: loading, fetchProducts } = useAdminDataStore();

  // Mostrar mensagem de sucesso se veio de navegação
  useEffect(() => {
    if (location.state?.successMessage) {
      handleSuccess(location.state.successMessage);
      // Limpar o estado para não mostrar novamente
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleSuccess]);

  const handleDeleteClick = (product: any) => {
    // Debounce para evitar múltiplos cliques
    if (isDeleting) return;
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) throw error;

      // Atualizar usando store
      await fetchProducts({ force: true });
      
      handleSuccess(`Produto "${productToDelete?.name || 'produto'}" removido com sucesso`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      handleError(error, 'Products - Delete');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
    };
    
    const labels: Record<string, string> = {
      active: "Ativo",
      inactive: "Inativo",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getStockBadge = (stockStatus?: string, quantity?: number) => {
    if (stockStatus === 'out_of_stock' || quantity === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>;
    }
    if ((quantity || 0) < 5) {
      return <Badge variant="outline">Estoque Baixo</Badge>;
    }
    return <Badge variant="default">Em Estoque</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <Button asChild className="gap-2 w-full sm:w-auto" size="sm">
          <Link to="/admin/produtos/novo">
            <Plus className="h-4 w-4" />
            {isMobile ? "Adicionar" : "Adicionar Produto"}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Produtos ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seu primeiro produto
              </p>
              <Button asChild className="gap-2">
                <Link to="/admin/produtos/novo">
                  <Plus className="h-4 w-4" />
                  Adicionar Primeiro Produto
                </Link>
              </Button>
            </div>
          ) : (
            <ResponsiveTable
              products={products as any}
              onDeleteClick={handleDeleteClick}
              formatPrice={formatPrice}
              getStatusBadge={getStatusBadge}
              getStockBadge={getStockBadge}
            />
            )}
        </CardContent>
      </Card>


      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;