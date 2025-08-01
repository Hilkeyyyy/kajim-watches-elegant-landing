import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  description: z.string().optional(),
  model: z.string().optional(),
  movement: z.string().optional(),
  case_size: z.string().optional(),
  material: z.string().optional(),
  water_resistance: z.string().optional(),
  warranty: z.string().optional(),
  watch_type: z.string().optional(),
  glass_type: z.string().optional(),
  stock_quantity: z.number().min(0, "Quantidade deve ser positiva"),
  stock_status: z.enum(['in_stock', 'low_stock', 'out_of_stock']),
  is_visible: z.boolean(),
  is_featured: z.boolean(),
  status: z.enum(['active', 'inactive', 'discontinued']),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  onSubmit: (data: ProductFormData & { images: ImageItem[], badges: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PRESET_BADGES = [
  'Novo', 'Oferta', 'Limitado', 'Destaque', 'Exclusivo', 'Premium', 'Best Seller'
];

export const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [images, setImages] = useState<ImageItem[]>(
    product?.images?.map((url: string, index: number) => ({
      id: `img-${index}`,
      url,
      isMain: index === 0
    })) || []
  );
  const [badges, setBadges] = useState<string[]>(product?.badges || []);
  const [newBadge, setNewBadge] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price?.toString() || "",
      brand: product?.brand || "",
      description: product?.description || "",
      model: product?.model || "",
      movement: product?.movement || "",
      case_size: product?.case_size || "",
      material: product?.material || "",
      water_resistance: product?.water_resistance || "",
      warranty: product?.warranty || "",
      watch_type: product?.watch_type || "",
      glass_type: product?.glass_type || "",
      stock_quantity: product?.stock_quantity || 0,
      stock_status: product?.stock_status || 'in_stock',
      is_visible: product?.is_visible ?? true,
      is_featured: product?.is_featured ?? false,
      status: product?.status || 'active',
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit({ ...data, images, badges });
  };

  const addBadge = (badge: string) => {
    if (badge && !badges.includes(badge)) {
      setBadges([...badges, badge]);
      setNewBadge("");
    }
  };

  const removeBadge = (badgeToRemove: string) => {
    setBadges(badges.filter(badge => badge !== badgeToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do relógio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="KAJIM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input placeholder="1299.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição detalhada do produto" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Elite, Classic, Sport" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="movement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Quartzo, Automático" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="case_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho da Caixa</FormLabel>
                    <FormControl>
                      <Input placeholder="42mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Aço inoxidável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="water_resistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resistência à Água</FormLabel>
                    <FormControl>
                      <Input placeholder="100m" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Stock & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do Estoque</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in_stock">Em Estoque</SelectItem>
                        <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                        <SelectItem value="out_of_stock">Esgotado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do Produto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="discontinued">Descontinuado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_visible"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Produto Visível</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Produto em Destaque</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormLabel>Badges Atuais</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {badge}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeBadge(badge)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <FormLabel>Adicionar Badge</FormLabel>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Nome do badge"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBadge(newBadge);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addBadge(newBadge)}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>

              <div>
                <FormLabel>Badges Pré-definidos</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_BADGES.map((badge) => (
                    <Button
                      key={badge}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBadge(badge)}
                      disabled={badges.includes(badge)}
                    >
                      {badge}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Imagens do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <MultipleImageUpload
              images={images}
              onImagesChange={(newImages) => setImages(newImages)}
              maxImages={5}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : product ? "Atualizar" : "Criar"} Produto
          </Button>
        </div>
      </form>
    </Form>
  );
};