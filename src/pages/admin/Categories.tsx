import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { Plus, Tag, Edit, Trash2, GripVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BrandCategory {
  id: string;
  brand_name: string;
  display_name: string;
  description?: string;
  custom_image_url?: string;
  sort_order: number;
  is_featured: boolean;
  is_visible: boolean;
  auto_generated: boolean;
  created_at: string;
  product_count?: number;
}

const Categories = () => {
  console.log('Categories - Component mounting');
  
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BrandCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<BrandCategory | null>(null);
  const [formData, setFormData] = useState({
    brand_name: '',
    display_name: '',
    description: '',
    custom_image_url: '',
    is_featured: false,
    is_visible: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      console.log('Categories - Fetching brand categories from Supabase');
      setLoading(true);
      
      // Buscar produtos únicos por marca para contar produtos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('brand')
        .eq('is_visible', true)
        .eq('status', 'active');

      if (productsError) throw productsError;

      // Contar produtos por marca
      const productCounts = products?.reduce((acc: Record<string, number>, product) => {
        acc[product.brand] = (acc[product.brand] || 0) + 1;
        return acc;
      }, {}) || {};

      // Buscar todas as categorias de marca
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Categories - Error fetching brand categories:', error);
        throw error;
      }
      
      // Adicionar contagem de produtos
      const categoriesWithCounts = (data || []).map(category => ({
        ...category,
        product_count: productCounts[category.brand_name] || 0
      }));
      
      console.log('Categories - Successfully fetched brand categories:', categoriesWithCounts.length);
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Categories - Error in fetchCategories:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      brand_name: '',
      display_name: '',
      description: '',
      custom_image_url: '',
      is_featured: false,
      is_visible: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category: BrandCategory) => {
    setEditingCategory(category);
    setFormData({
      brand_name: category.brand_name,
      display_name: category.display_name,
      description: category.description || '',
      custom_image_url: category.custom_image_url || '',
      is_featured: category.is_featured,
      is_visible: category.is_visible,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (category: BrandCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const { error } = await supabase
        .from('brand_categories')
        .delete()
        .eq('id', categoryToDelete.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!"
      });

      fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_name.trim() || !formData.display_name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da marca e nome de exibição são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const categoryData = {
        brand_name: formData.brand_name.trim(),
        display_name: formData.display_name.trim(),
        description: formData.description.trim() || null,
        custom_image_url: formData.custom_image_url || null,
        is_featured: formData.is_featured,
        is_visible: formData.is_visible,
        sort_order: editingCategory ? editingCategory.sort_order : categories.length,
        auto_generated: false, // Marcamos como criado manualmente
      };

      let error;
      if (editingCategory) {
        ({ error } = await supabase
          .from('brand_categories')
          .update(categoryData)
          .eq('id', editingCategory.id));
      } else {
        ({ error } = await supabase
          .from('brand_categories')
          .insert(categoryData));
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: editingCategory 
          ? "Categoria atualizada com sucesso!"
          : "Categoria criada com sucesso!"
      });

      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar categoria",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateSortOrder = async (categoryId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('brand_categories')
        .update({ sort_order: newOrder })
        .eq('id', categoryId);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem da categoria",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('Categories - Component mounted, fetching data');
    fetchCategories();
  }, []);

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
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">
            Organize seus produtos por categorias
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Lista de Categorias ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira categoria
              </p>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeira Categoria
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Ordem</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="text-sm text-muted-foreground">
                          {category.sort_order}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {category.custom_image_url ? (
                          <img
                            src={category.custom_image_url}
                            alt={category.display_name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                            <Tag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{category.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.brand_name} • {category.product_count || 0} produtos
                          </div>
                          {category.is_featured && (
                            <span className="text-xs text-primary">⭐ Destaque</span>
                          )}
                          {category.auto_generated && (
                            <span className="text-xs text-blue-600">🤖 Auto</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {category.description || "Sem descrição"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${category.is_visible ? 'text-green-600' : 'text-red-600'}`}>
                          {category.is_visible ? 'Visível' : 'Oculta'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(category)}
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
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_name">Nome da Marca *</Label>
                <Input
                  id="brand_name"
                  value={formData.brand_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                  placeholder="Ex: Rolex"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="display_name">Nome de Exibição *</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Ex: Rolex - Precisão Suíça"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Imagem da Categoria</Label>
                <ImageUpload
                  bucket="category-images"
                  path={`brands/${formData.brand_name.replace(/\s+/g, '-').toLowerCase()}`}
                  maxSizeInMB={15}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, custom_image_url: url }))}
                  onImageRemoved={() => setFormData(prev => ({ ...prev, custom_image_url: '' }))}
                  currentImageUrl={formData.custom_image_url}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da categoria (opcional)"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : editingCategory ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.display_name}"?
              Esta ação não pode ser desfeita e pode afetar a organização dos produtos.
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

export default Categories;