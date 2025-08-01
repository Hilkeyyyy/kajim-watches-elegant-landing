import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string;
}

export const ProductModal = ({ isOpen, onClose, onSuccess, productId }: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    description: '',
    category_id: '',
    movement: '',
    case_size: '',
    material: '',
    water_resistance: '',
    warranty: '',
    stock_quantity: '',
    stock_status: 'in_stock',
    status: 'active',
    is_visible: true,
    is_featured: false,
    image_url: '',
    images: [] as string[],
    features: [] as string[],
    badges: [] as string[],
    custom_tags: [] as string[]
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (productId) {
        fetchProduct();
      } else {
        resetForm();
      }
    }
  }, [isOpen, productId]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      
      setFormData({
        name: data.name || '',
        brand: data.brand || '',
        model: data.model || '',
        price: data.price?.toString() || '',
        description: data.description || '',
        category_id: data.category_id || '',
        movement: data.movement || '',
        case_size: data.case_size || '',
        material: data.material || '',
        water_resistance: data.water_resistance || '',
        warranty: data.warranty || '',
        stock_quantity: data.stock_quantity?.toString() || '',
        stock_status: data.stock_status || 'in_stock',
        status: data.status || 'active',
        is_visible: data.is_visible ?? true,
        is_featured: data.is_featured ?? false,
        image_url: data.image_url || '',
        images: data.images || [],
        features: data.features || [],
        badges: data.badges || [],
        custom_tags: data.custom_tags || []
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do produto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      price: '',
      description: '',
      category_id: '',
      movement: '',
      case_size: '',
      material: '',
      water_resistance: '',
      warranty: '',
      stock_quantity: '',
      stock_status: 'in_stock',
      status: 'active',
      is_visible: true,
      is_featured: false,
      image_url: '',
      images: [],
      features: [],
      badges: [],
      custom_tags: []
    });
    setNewFeature('');
    setNewBadge('');
    setNewTag('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model || null,
        price: parseFloat(formData.price),
        description: formData.description || null,
        category_id: formData.category_id || null,
        movement: formData.movement || null,
        case_size: formData.case_size || null,
        material: formData.material || null,
        water_resistance: formData.water_resistance || null,
        warranty: formData.warranty || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        stock_status: formData.stock_status,
        status: formData.status === 'draft' ? 'inactive' : formData.status as 'active' | 'inactive',
        is_visible: formData.is_visible,
        is_featured: formData.is_featured,
        image_url: formData.image_url || null,
        images: formData.images.length > 0 ? formData.images : null,
        features: formData.features.length > 0 ? formData.features : null,
        badges: formData.badges.length > 0 ? formData.badges : null,
        custom_tags: formData.custom_tags.length > 0 ? formData.custom_tags : null,
      };

      let error;
      if (productId) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert(productData));
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: productId ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!"
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addBadge = () => {
    if (newBadge.trim() && !formData.badges.includes(newBadge.trim())) {
      setFormData(prev => ({
        ...prev,
        badges: [...prev.badges, newBadge.trim()]
      }));
      setNewBadge('');
    }
  };

  const removeBadge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.custom_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        custom_tags: [...prev.custom_tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      custom_tags: prev.custom_tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {productId ? 'Editar Produto' : 'Adicionar Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Especificações Técnicas */}
          <div className="space-y-4">
            <h3 className="font-semibold">Especificações Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="movement">Movimento</Label>
                <Input
                  id="movement"
                  value={formData.movement}
                  onChange={(e) => setFormData(prev => ({ ...prev, movement: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case_size">Tamanho da Caixa</Label>
                <Input
                  id="case_size"
                  value={formData.case_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, case_size: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water_resistance">Resistência à Água</Label>
                <Input
                  id="water_resistance"
                  value={formData.water_resistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, water_resistance: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Garantia</Label>
                <Input
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Status e Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_status">Status do Estoque</Label>
              <Select
                value={formData.stock_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, stock_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">Em Estoque</SelectItem>
                  <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                  <SelectItem value="out_of_stock">Esgotado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status do Produto</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                />
                <Label htmlFor="is_visible">Visível no site</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <Label htmlFor="is_featured">Produto em destaque</Label>
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="space-y-4">
            <h3 className="font-semibold">Imagens</h3>
            <div className="space-y-2">
              <Label htmlFor="image_url">URL da Imagem Principal</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          {/* Características */}
          <div className="space-y-4">
            <h3 className="font-semibold">Características</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nova característica"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h3 className="font-semibold">Badges</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="Novo badge"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                />
                <Button type="button" onClick={addBadge} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {badge}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeBadge(index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tags</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nova tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.custom_tags.map((tag, index) => (
                  <Badge key={index} variant="default" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (productId ? 'Atualizar' : 'Criar')} Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};