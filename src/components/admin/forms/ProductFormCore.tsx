import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import { ProductFormMain } from "./ProductFormMain";
import { ProductFormImages } from "./ProductFormImages";
import { ProductFormSpecs } from "./ProductFormSpecs";
import { ProductFormMetadata } from "./ProductFormMetadata";
import { useToast } from "@/hooks/use-toast";

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

interface ProductFormCoreProps {
  product?: any;
  onSubmit: (data: ProductFormData & { images: ImageItem[], badges: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const ProductFormCore: React.FC<ProductFormCoreProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
  mode
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
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
      stock_quantity: product?.stock_quantity || 0,
      is_visible: product?.is_visible ?? true,
      is_featured: product?.is_featured ?? false,
      status: product?.status || 'active',
    },
  });

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    try {
      if (images.length === 0) {
        toast({
          title: "Atenção",
          description: "Adicione pelo menos uma imagem ao produto",
          variant: "destructive"
        });
        return;
      }

      await onSubmit({ ...data, images, badges });
    } catch (error) {
      console.error('Erro no formulário:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [images, badges, onSubmit, toast]);

  const addBadge = useCallback((badge: string) => {
    if (badge && !badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
    }
  }, [badges]);

  const removeBadge = useCallback((badgeToRemove: string) => {
    setBadges(prev => prev.filter(badge => badge !== badgeToRemove));
  }, []);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, title: "Informações Básicas", description: "Nome, preço e descrição" },
    { id: 2, title: "Imagens", description: "Fotos do produto" },
    { id: 3, title: "Especificações", description: "Detalhes técnicos" },
    { id: 4, title: "Metadados", description: "Status e configurações" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Criar Produto' : 'Editar Produto'}
            </h1>
            <p className="text-muted-foreground">
              {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
              currentStep === step.id
                ? 'border-primary bg-primary/5 text-primary'
                : currentStep > step.id
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-muted bg-muted/20 text-muted-foreground'
            }`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="text-sm font-medium">{step.title}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <ProductFormMain form={form} />
              )}
              
              {currentStep === 2 && (
                <ProductFormImages
                  images={images}
                  onImagesChange={setImages}
                  badges={badges}
                  addBadge={addBadge}
                  removeBadge={removeBadge}
                />
              )}
              
              {currentStep === 3 && (
                <ProductFormSpecs form={form} />
              )}
              
              {currentStep === 4 && (
                <ProductFormMetadata form={form} />
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Anterior
                    </Button>
                  )}
                  {currentStep < 4 && (
                    <Button type="button" onClick={nextStep}>
                      Próximo
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Salvando..." : mode === 'create' ? "Criar" : "Atualizar"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};