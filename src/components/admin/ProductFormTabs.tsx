import React, { useState, useCallback, memo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultipleImageUpload } from '@/components/MultipleImageUpload';
import { AVAILABLE_BADGES, BadgeType } from '@/types/badge';
import { Plus, X } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormData {
  name: string;
  price: string;
  brand: string;
  description?: string;
  model?: string;
  movement?: string;
  case_size?: string;
  material?: string;
  water_resistance?: string;
  warranty?: string;
  watch_type?: string;
  glass_type?: string;
  dial_color?: string;
  strap_material?: string;
  stock_quantity?: number;
  is_visible?: boolean;
  is_featured?: boolean;
  status?: 'active' | 'inactive' | 'discontinued';
}

interface ProductFormTabsProps {
  form: UseFormReturn<ProductFormData>;
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
  badges: string[];
  addBadge: (badge: string) => void;
  removeBadge: (badge: string) => void;
}

export const MainInfoTab = memo(({ form }: { form: UseFormReturn<ProductFormData> }) => {
  console.log('MainInfoTab renderizando');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do produto" {...field} />
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
              <FormLabel>Preço *</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
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
              <FormLabel>Marca *</FormLabel>
              <FormControl>
                <Input placeholder="Digite a marca" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o modelo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descrição detalhada do produto..."
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

MainInfoTab.displayName = 'MainInfoTab';

export const BadgesTab = memo(({ badges, addBadge, removeBadge }: {
  badges: string[];
  addBadge: (badge: string) => void;
  removeBadge: (badge: string) => void;
}) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('');

  const handleAddBadge = useCallback(() => {
    if (selectedBadge && !badges.includes(selectedBadge)) {
      addBadge(selectedBadge);
      setSelectedBadge('');
    }
  }, [selectedBadge, badges, addBadge]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Badge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={selectedBadge} onValueChange={setSelectedBadge}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione uma badge" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_BADGES
                  .filter(badge => !badges.includes(badge))
                  .map((badge) => (
                    <SelectItem key={badge} value={badge}>
                      {badge}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              onClick={handleAddBadge}
              disabled={!selectedBadge || badges.includes(selectedBadge)}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges Selecionadas</CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma badge selecionada</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                  {badge}
                  <button
                    type="button"
                    onClick={() => removeBadge(badge)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remover badge ${badge}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

BadgesTab.displayName = 'BadgesTab';

export const SpecificationsTab = memo(({ form }: { form: UseFormReturn<ProductFormData> }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="movement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movimento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Automático, Quartzo" {...field} />
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
                <Input placeholder="Ex: 42mm" {...field} />
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
                <Input placeholder="Ex: Aço Inoxidável" {...field} />
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
                <Input placeholder="Ex: 100m, 10ATM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="watch_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do Relógio</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sport">Esportivo</SelectItem>
                    <SelectItem value="dress">Social</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="luxury">Luxo</SelectItem>
                    <SelectItem value="diving">Mergulho</SelectItem>
                    <SelectItem value="aviation">Aviação</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="glass_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do Vidro</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sapphire">Safira</SelectItem>
                    <SelectItem value="mineral">Mineral</SelectItem>
                    <SelectItem value="acrylic">Acrílico</SelectItem>
                    <SelectItem value="hardlex">Hardlex</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dial_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor do Mostrador</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Preto, Branco, Azul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strap_material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material da Pulseira</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Couro, Aço, Silicone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warranty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Garantia</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 2 anos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
});

SpecificationsTab.displayName = 'SpecificationsTab';

export const OtherInfoTab = memo(({ form, images, setImages }: {
  form: UseFormReturn<ProductFormData>;
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="discontinued">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="is_visible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Produto Visível</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marque para exibir o produto na loja
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Produto em Destaque</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marque para destacar o produto
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imagens do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload 
            images={images}
            onImagesChange={setImages}
            maxImages={10}
          />
        </CardContent>
      </Card>
    </div>
  );
});

OtherInfoTab.displayName = 'OtherInfoTab';