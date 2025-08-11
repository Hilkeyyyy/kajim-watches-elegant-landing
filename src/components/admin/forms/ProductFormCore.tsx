import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import { ProductFormMain } from "./ProductFormMain";
import { ProductFormImages } from "./ProductFormImages";
import { ProductFormBasicSpecs } from "./ProductFormBasicSpecs";
import { ProductFormDimensions } from "./ProductFormDimensions";
import { ProductFormMaterials } from "./ProductFormMaterials";
import { ProductFormColors } from "./ProductFormColors";
import { ProductFormAdvancedSpecsComplete } from "./ProductFormAdvancedSpecsComplete";
import { ProductFormCommercial } from "./ProductFormCommercial";
import { ProductFormMetadata } from "./ProductFormMetadata";
import { ProductFormFeatures } from "./ProductFormFeatures";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductFormPrices } from "./ProductFormPrices";
import { ProductFormBadges } from "./ProductFormBadges";
import { ProductFormDescription } from "./ProductFormDescription";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  original_price: z.string().optional(),
  brand: z.string().min(1, "Marca é obrigatória"),
  description: z.string().optional(),
  model: z.string().optional(),
  
  // Especificações básicas
  movement: z.string().optional(),
  caliber: z.string().optional(),
  watch_type: z.string().optional(),
  collection: z.string().optional(),
  reference_number: z.string().optional(),
  production_year: z.string().optional(),
  jewels_count: z.string().optional(),
  frequency_hz: z.string().optional(),
  power_reserve: z.string().optional(),
  amplitude_degrees: z.string().optional(),
  beat_error_ms: z.string().optional(),
  
  // Dimensões
  case_diameter: z.string().optional(),
  case_height: z.string().optional(),
  case_thickness: z.string().optional(),
  lug_to_lug: z.string().optional(),
  lug_width_mm: z.string().optional(),
  weight: z.string().optional(),
  crown_diameter: z.string().optional(),
  crystal_diameter: z.string().optional(),
  bezel_type: z.string().optional(),
  bracelet_width: z.string().optional(),
  bracelet_length: z.string().optional(),
  
  // Materiais
  case_material: z.string().optional(),
  bezel_material: z.string().optional(),
  crystal: z.string().optional(),
  glass_type: z.string().optional(),
  dial_material: z.string().optional(),
  hands_material: z.string().optional(),
  crown_material: z.string().optional(),
  caseback_material: z.string().optional(),
  strap_material: z.string().optional(),
  bracelet_material: z.string().optional(),
  clasp_material: z.string().optional(),
  indices_material: z.string().optional(),
  
  // Cores
  dial_color: z.string().optional(),
  dial_colors: z.array(z.string()).optional(),
  case_color: z.string().optional(),
  bezel_color: z.string().optional(),
  hands_color: z.string().optional(),
  markers_color: z.string().optional(),
  strap_color: z.string().optional(),
  dial_pattern: z.string().optional(),
  dial_finish: z.string().optional(),
  
  // Especificações avançadas
  water_resistance_meters: z.string().optional(),
  water_resistance_atm: z.string().optional(),
  anti_magnetic_resistance: z.string().optional(),
  shock_resistant: z.boolean().optional(),
  temperature_resistance: z.string().optional(),
  indices_type: z.string().optional(),
  numerals_type: z.string().optional(),
  hands_type: z.string().optional(),
  lume_type: z.string().optional(),
  crown_type: z.string().optional(),
  case_back: z.string().optional(),
  clasp_type: z.string().optional(),
  buckle_type: z.string().optional(),
  certification: z.string().optional(),
  warranty: z.string().optional(),
  country_origin: z.string().optional(),
  limited_edition: z.string().optional(),
  
  // Comerciais
  msrp: z.string().optional(),
  availability_status: z.string().optional(),
  replacement_model: z.string().optional(),
  box_type: z.string().optional(),
  documentation: z.string().optional(),
  
  // Características
  features: z.array(z.string()).optional(),

  // Status do produto
  stock_quantity: z.number().min(0, "Quantidade deve ser positiva").optional(),
  is_visible: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

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
  const { handleError, handleWarning } = useErrorHandler();
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
      // Informações básicas
      name: product?.name || "",
      price: product?.price?.toString() || "",
      original_price: product?.original_price?.toString() || "",
      brand: product?.brand || "",
      description: product?.description || "",
      model: product?.model || "",
      
      // Especificações básicas
      movement: product?.movement || "",
      caliber: product?.caliber || "",
      watch_type: product?.watch_type || "",
      collection: product?.collection || "",
      reference_number: product?.reference_number || "",
      production_year: product?.production_year || "",
      jewels_count: product?.jewels_count || "",
      frequency_hz: product?.frequency_hz || "",
      power_reserve: product?.power_reserve || "",
      amplitude_degrees: product?.amplitude_degrees || "",
      beat_error_ms: product?.beat_error_ms || "",
      
      // Dimensões
      case_diameter: product?.case_diameter || "",
      case_height: product?.case_height || "",
      case_thickness: product?.case_thickness || "",
      lug_to_lug: product?.lug_to_lug || "",
      lug_width_mm: product?.lug_width_mm || "",
      weight: product?.weight || "",
      crown_diameter: product?.crown_diameter || "",
      crystal_diameter: product?.crystal_diameter || "",
      bezel_type: product?.bezel_type || "",
      bracelet_width: product?.bracelet_width || "",
      bracelet_length: product?.bracelet_length || "",
      
      // Materiais
      case_material: product?.case_material || "",
      bezel_material: product?.bezel_material || "",
      crystal: product?.crystal || "",
      glass_type: product?.glass_type || "",
      dial_material: product?.dial_material || "",
      hands_material: product?.hands_material || "",
      crown_material: product?.crown_material || "",
      caseback_material: product?.caseback_material || "",
      strap_material: product?.strap_material || "",
      bracelet_material: product?.bracelet_material || "",
      clasp_material: product?.clasp_material || "",
      indices_material: product?.indices_material || "",
      
      // Cores
      dial_color: product?.dial_color || "",
      dial_colors: product?.dial_colors || [],
      case_color: product?.case_color || "",
      bezel_color: product?.bezel_color || "",
      hands_color: product?.hands_color || "",
      markers_color: product?.markers_color || "",
      strap_color: product?.strap_color || "",
      dial_pattern: product?.dial_pattern || "",
      dial_finish: product?.dial_finish || "",
      
      // Especificações avançadas
      water_resistance_meters: product?.water_resistance_meters || "",
      water_resistance_atm: product?.water_resistance_atm || "",
      anti_magnetic_resistance: product?.anti_magnetic_resistance || "",
      shock_resistant: product?.shock_resistant || false,
      temperature_resistance: product?.temperature_resistance || "",
      indices_type: product?.indices_type || "",
      numerals_type: product?.numerals_type || "",
      hands_type: product?.hands_type || "",
      lume_type: product?.lume_type || "",
      crown_type: product?.crown_type || "",
      case_back: product?.case_back || "",
      clasp_type: product?.clasp_type || "",
      buckle_type: product?.buckle_type || "",
      certification: product?.certification || "",
      warranty: product?.warranty || "",
      country_origin: product?.country_origin || "",
      limited_edition: product?.limited_edition || "",
      
      // Comerciais
      msrp: product?.msrp || "",
      availability_status: product?.availability_status || "",
      replacement_model: product?.replacement_model || "",
      box_type: product?.box_type || "",
      documentation: product?.documentation || "",
      
      // Características
      features: product?.features || [],

      // Status do produto
      stock_quantity: product?.stock_quantity || 0,
      is_visible: product?.is_visible ?? true,
      is_featured: product?.is_featured ?? false,
      status: product?.status || 'active',
    },
  });

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    try {
      if (images.length === 0) {
        handleWarning("Adicione pelo menos uma imagem ao produto");
        return;
      }

      await onSubmit({ ...data, images, badges });
    } catch (error) {
      console.error('Erro no formulário:', error);
      handleError(error, 'ProductFormCore - Submit');
    }
  }, [images, badges, onSubmit, handleError, handleWarning]);

  const addBadge = useCallback((badge: string) => {
    if (badge && !badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
    }
  }, [badges]);

  const removeBadge = useCallback((badgeToRemove: string) => {
    setBadges(prev => prev.filter(badge => badge !== badgeToRemove));
  }, []);


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Criar Produto' : 'Editar Produto'}
            </h1>
            <p className="text-muted-foreground">Preencha as informações do produto</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Accordion type="multiple" defaultValue={["images","basic","prices","badges","specs","description","commercial","status"]}>
                <AccordionItem value="images">
                  <AccordionTrigger>Imagens</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormImages
                      images={images}
                      onImagesChange={setImages}
                      badges={badges}
                      addBadge={addBadge}
                      removeBadge={removeBadge}
                      showBadges={false}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="basic">
                  <AccordionTrigger>Informações Básicas</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormMain form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prices">
                  <AccordionTrigger>Preços</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormPrices form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="badges">
                  <AccordionTrigger>Badges</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormBadges badges={badges} addBadge={addBadge} removeBadge={removeBadge} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specs">
                  <AccordionTrigger>Especificações</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <ProductFormFeatures form={form} />
                      <ProductFormBasicSpecs form={form} />
                      <ProductFormDimensions form={form} />
                      <ProductFormMaterials form={form} />
                      <ProductFormColors form={form} />
                      <ProductFormAdvancedSpecsComplete form={form} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="description">
                  <AccordionTrigger>Descrição</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormDescription form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="commercial">
                  <AccordionTrigger>Comercial</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormCommercial form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="status">
                  <AccordionTrigger>Status e Visibilidade</AccordionTrigger>
                  <AccordionContent>
                    <ProductFormMetadata form={form} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Actions */}
              <div className="flex justify-between pt-6 border-t">
                <Button type="button" variant="ghost" onClick={onCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : mode === 'create' ? "Criar" : "Atualizar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};