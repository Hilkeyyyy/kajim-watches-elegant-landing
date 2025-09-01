import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  bucket: string;
  path?: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  accept?: string;
  maxSizeInMB?: number;
  className?: string;
}

export const ImageUpload = ({
  bucket,
  path = "",
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  accept = "image/*",
  maxSizeInMB = 5,
  className = "",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho do arquivo
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O arquivo deve ter no máximo ${maxSizeInMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    // Criar preview local imediato
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      // Se existe imagem anterior, remover
      if (currentImageUrl && currentImageUrl.includes(bucket)) {
        const oldPath = currentImageUrl.split(`${bucket}/`)[1];
        if (oldPath) {
          await supabase.storage
            .from(bucket)
            .remove([oldPath]);
        }
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (error) throw error;

      // Obter URL público da imagem
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Limpar preview local e usar URL oficial
      URL.revokeObjectURL(localUrl);
      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Imagem carregada",
        description: "A imagem foi enviada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      
      // Remover preview local em caso de erro
      URL.revokeObjectURL(localUrl);
      setPreviewUrl(currentImageUrl || null);
      
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer o upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Imagem</Label>
      
      {previewUrl ? (
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border bg-muted">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback para imagens com erro
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para selecionar uma imagem
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxSizeInMB}MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Enviando...' : previewUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};