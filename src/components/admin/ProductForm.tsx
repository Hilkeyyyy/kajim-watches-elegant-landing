import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { MainInfoTab, BadgesTab, SpecificationsTab, OtherInfoTab } from "./ProductFormTabs";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

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
  dial_color: z.string().optional(),
  strap_material: z.string().optional(),
  stock_quantity: z.number().min(0, "Quantidade deve ser positiva").optional(),
  is_visible: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  onSubmit: (data: ProductFormData & { images: ImageItem[], badges: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [images, setImages] = useState<ImageItem[]>(
    product?.images?.map((url: string, index: number) => ({
      id: `img-${index}`,
      url,
      isMain: index === 0
    })) || []
  );
  const [badges, setBadges] = useState<string[]>(product?.badges || []);

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
      dial_color: product?.dial_color || "",
      strap_material: product?.strap_material || "",
      stock_quantity: product?.stock_quantity || undefined,
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
    }
  };

  const removeBadge = (badgeToRemove: string) => {
    setBadges(badges.filter(badge => badge !== badgeToRemove));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="main">Informações Principais</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="specs">Especificações</TabsTrigger>
                <TabsTrigger value="other">Outras Informações</TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                <MainInfoTab form={form} />
              </TabsContent>

              <TabsContent value="badges" className="mt-6">
                <BadgesTab 
                  badges={badges} 
                  addBadge={addBadge} 
                  removeBadge={removeBadge} 
                />
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <SpecificationsTab form={form} />
              </TabsContent>

              <TabsContent value="other" className="mt-6">
                <OtherInfoTab 
                  form={form} 
                  images={images} 
                  setImages={setImages} 
                />
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : product ? "Atualizar" : "Criar"} Produto
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};