import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AVAILABLE_BADGES, BadgeType } from "@/types/badge";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormData {
  name: string;
  price: string;
  brand: string;
  model?: string;
  description?: string;
  stock_quantity?: number;
  is_visible?: boolean;
  is_featured?: boolean;
  status?: 'active' | 'inactive' | 'discontinued';
  movement?: string;
  case_size?: string;
  material?: string;
  water_resistance?: string;
  warranty?: string;
  watch_type?: string;
  bezel_type?: string;
  glass_type?: string;
  clasp_type?: string;
  certification?: string;
  power_reserve?: string;
  dial_color?: string;
  strap_material?: string;
  weight?: string;
  thickness?: string;
  lug_width?: string;
  country_origin?: string;
}

interface ProductFormTabsProps {
  form: UseFormReturn<ProductFormData>;
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
  badges: string[];
  addBadge: (badge: string) => void;
  removeBadge: (badge: string) => void;
}

export const MainInfoTab = ({ form }: { form: UseFormReturn<ProductFormData> }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço</FormLabel>
            <FormControl>
              <Input placeholder="1999.99" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marca</FormLabel>
            <FormControl>
              <Input placeholder="Marca do relógio" {...field} />
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
              <Input placeholder="Modelo do relógio" {...field} />
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
              placeholder="Descrição detalhada do produto"
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

export const BadgesTab = ({ badges, addBadge, removeBadge }: { badges: string[], addBadge: (badge: string) => void, removeBadge: (badge: string) => void }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium mb-4">Badges Disponíveis</h3>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {AVAILABLE_BADGES.map((badge) => (
          <Button
            key={badge}
            type="button"
            variant={badges.includes(badge) ? "default" : "outline"}
            onClick={() => {
              if (badges.includes(badge)) {
                removeBadge(badge);
              } else {
                addBadge(badge);
              }
            }}
            className="w-full"
          >
            {badge}
          </Button>
        ))}
      </div>
    </div>

    {badges.length > 0 && (
      <div>
        <h3 className="text-lg font-medium mb-4">Badges Selecionadas</h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary" className="text-sm">
              {badge}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={() => removeBadge(badge)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);

export const SpecificationsTab = ({ form }: { form: UseFormReturn<ProductFormData> }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="movement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Movimento</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Automático" {...field} />
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
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="material"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Material</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Aço inoxidável" {...field} />
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
              <Input placeholder="Ex: 100m" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="dial_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor do Mostrador</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Preto" {...field} />
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
              <Input placeholder="Ex: Couro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export const OtherInfoTab = ({ form, images, setImages }: { form: UseFormReturn<ProductFormData>, images: ImageItem[], setImages: (images: ImageItem[]) => void }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="is_visible"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Produto Visível</FormLabel>
            </div>
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Produto em Destaque</FormLabel>
            </div>
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

    <div>
      <FormLabel className="text-base mb-4 block">Imagens do Produto</FormLabel>
      <MultipleImageUpload
        images={images}
        onImagesChange={setImages}
        maxImages={10}
      />
    </div>
  </div>
);