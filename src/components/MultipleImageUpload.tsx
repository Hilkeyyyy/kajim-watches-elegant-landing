import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecurity } from '@/hooks/useSecurity';
import { logSecurityEvent } from '@/utils/auditLogger';

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface MultipleImageUploadProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  maxSizeInMB?: number;
  className?: string;
}

export const MultipleImageUpload = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizeInMB = 5,
  className = ""
}: MultipleImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { validateFileUpload } = useSecurity();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite de imagens",
        description: `Máximo de ${maxImages} imagens permitidas`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const validFiles: File[] = [];
      
      // Validar cada arquivo com proteções de segurança
      for (const file of Array.from(files)) {
        const validation = validateFileUpload(file);
        
        if (!validation.isValid) {
          toast({
            title: "Arquivo rejeitado",
            description: `${file.name}: ${validation.error}`,
            variant: "destructive"
          });
          continue;
        }
        
        // Validação adicional de tamanho específica
        if (file.size > maxSizeInMB * 1024 * 1024) {
          toast({
            title: "Arquivo muito grande",
            description: `${file.name}: Máximo ${maxSizeInMB}MB`,
            variant: "destructive"
          });
          continue;
        }
        
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        logSecurityEvent('all_upload_files_rejected', { 
          attempted_count: files.length,
          timestamp: Date.now()
        });
        return;
      }

      const uploadPromises = validFiles.map(async (file) => {

        // Gerar nome único
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload para Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return {
          id: Math.random().toString(36).substring(2),
          url: publicUrl,
          isMain: images.length === 0 && !images.some(img => img.isMain) // Primeira imagem é principal se não houver principal
        };
      });

      const newImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImages]);

      toast({
        title: "Sucesso",
        description: `${newImages.length} imagem(ns) enviada(s) com sucesso!`
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Limpar input
      event.target.value = '';
    }
  }, [images, maxImages, maxSizeInMB, onImagesChange, toast, validateFileUpload]);

  const removeImage = useCallback((id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    
    // Se removemos a imagem principal e ainda há imagens, definir a primeira como principal
    if (images.find(img => img.id === id)?.isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const setMainImage = useCallback((id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === id
    }));
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const moveImage = useCallback((id: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];
    
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Imagens do Produto</h4>
        <Badge variant="outline">
          {images.length}/{maxImages}
        </Badge>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="multiple-image-upload"
          disabled={uploading || images.length >= maxImages}
        />
        <label
          htmlFor="multiple-image-upload"
          className={`cursor-pointer ${(uploading || images.length >= maxImages) ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            {uploading ? 'Enviando...' : 'Clique para selecionar imagens'}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG até {maxSizeInMB}MB cada
          </p>
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-colors aspect-square"
            >
              <img
                src={image.url}
                alt={`Produto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  {!image.isMain && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMainImage(image.id)}
                      className="text-xs"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </Button>
                  )}
                  
                  <div className="flex space-x-1">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveImage(image.id, 'up')}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {index < images.length - 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveImage(image.id, 'down')}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Main image badge */}
              {image.isMain && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Badge>
                </div>
              )}

              {/* Remove button */}
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                onClick={() => removeImage(image.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma imagem adicionada ainda
        </p>
      )}
    </div>
  );
};