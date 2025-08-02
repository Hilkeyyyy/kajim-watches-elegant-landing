import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/ProductForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string;
}

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

export const ProductModal = ({ isOpen, onClose, onSuccess, productId }: ProductModalProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      // Convert images array to proper format for database
      const imageUrls = formData.images?.length > 0 ? formData.images.map((img: ImageItem) => img.url) : null;
      const mainImageUrl = formData.images?.find((img: ImageItem) => img.isMain)?.url || formData.images?.[0]?.url || null;

      const productData = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model || null,
        price: parseFloat(formData.price),
        description: formData.description || null,
        collection: formData.collection || null,
        reference_number: formData.reference_number || null,
        limited_edition: formData.limited_edition || null,
        production_year: formData.production_year || null,
        
        movement: formData.movement || null,
        jewels: formData.jewels || null,
        frequency: formData.frequency || null,
        amplitude: formData.amplitude || null,
        beat_error: formData.beat_error || null,
        power_reserve: formData.power_reserve || null,
        complications: formData.complications?.length > 0 ? formData.complications : null,
        calendar_type: formData.calendar_type || null,
        timezone_display: formData.timezone_display || null,
        chronograph_type: formData.chronograph_type || null,
        subdials: formData.subdials || null,
        
        case_size: formData.case_size || null,
        material: formData.material || null,
        thickness: formData.thickness || null,
        weight: formData.weight || null,
        case_back: formData.case_back || null,
        crown_type: formData.crown_type || null,
        pushers: formData.pushers || null,
        bezel_type: formData.bezel_type || null,
        lug_width: formData.lug_width || null,
        
        dial_color: formData.dial_color || null,
        hands_type: formData.hands_type || null,
        markers_type: formData.markers_type || null,
        glass_type: formData.glass_type || null,
        date_display: formData.date_display || null,
        lume_type: formData.lume_type || null,
        luminosity: formData.luminosity || null,
        
        strap_material: formData.strap_material || null,
        bracelet_type: formData.bracelet_type || null,
        clasp_type: formData.clasp_type || null,
        buckle_type: formData.buckle_type || null,
        
        water_resistance: formData.water_resistance || null,
        shock_resistance: formData.shock_resistance || null,
        anti_magnetic: formData.anti_magnetic || null,
        operating_temperature: formData.operating_temperature || null,
        altitude_resistance: formData.altitude_resistance || null,
        pressure_resistance: formData.pressure_resistance || null,
        vibration_resistance: formData.vibration_resistance || null,
        
        watch_type: formData.watch_type || null,
        certification: formData.certification || null,
        warranty: formData.warranty || null,
        country_origin: formData.country_origin || null,
        special_features: formData.special_features?.length > 0 ? formData.special_features : null,
        
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        stock_status: formData.stock_status,
        status: formData.status === 'draft' ? 'inactive' : formData.status as 'active' | 'inactive',
        is_visible: formData.is_visible,
        is_featured: formData.is_featured,
        
        image_url: mainImageUrl,
        images: imageUrls,
        features: formData.features?.length > 0 ? formData.features : null,
        badges: formData.badges?.length > 0 ? formData.badges : null,
        custom_tags: formData.custom_tags?.length > 0 ? formData.custom_tags : null,
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

  useEffect(() => {
    if (isOpen) {
      if (productId) {
        fetchProduct();
      } else {
        setProduct(null);
      }
    }
  }, [isOpen, productId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[95vh]' : 'max-w-4xl max-h-[90vh]'} overflow-hidden p-0`}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {productId ? "Editar Produto" : "Criar Produto"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto px-6 pb-6">
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};