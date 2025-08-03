import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Star, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormImagesProps {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  badges: string[];
  addBadge: (badge: string) => void;
  removeBadge: (badge: string) => void;
}

export const ProductFormImages: React.FC<ProductFormImagesProps> = ({
  images,
  setImages,
  badges,
  addBadge,
  removeBadge
}) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newBadge, setNewBadge] = useState("");

  const addImage = () => {
    if (newImageUrl.trim()) {
      const newImage: ImageItem = {
        id: `img-${Date.now()}`,
        url: newImageUrl.trim(),
        isMain: images.length === 0
      };
      setImages(prev => [...prev, newImage]);
      setNewImageUrl("");
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // Se removemos a imagem principal, torna a primeira como principal
      if (filtered.length > 0 && prev.find(img => img.id === imageId)?.isMain) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (imageId: string) => {
    setImages(prev => 
      prev.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    );
  };

  const handleAddBadge = () => {
    if (newBadge.trim()) {
      addBadge(newBadge.trim());
      setNewBadge("");
    }
  };

  const predefinedBadges = [
    "Novidade", "Promoção", "Limitado", "Exclusivo", "Best Seller",
    "Luxo", "Esportivo", "Vintage", "Automático", "Cronógrafo"
  ];

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Imagens do Produto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Image */}
          <div className="flex gap-2">
            <Input
              placeholder="URL da imagem"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addImage()}
            />
            <Button onClick={addImage} disabled={!newImageUrl.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={image.url}
                      alt="Produto"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  {/* Image Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {!image.isMain && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMainImage(image.id)}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeImage(image.id)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Main Image Badge */}
                  {image.isMain && (
                    <Badge 
                      className="absolute top-2 left-2 bg-yellow-500 text-black"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Principal
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Adicione pelo menos uma imagem para o produto
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle>Badges do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Badge */}
          <div className="flex gap-2">
            <Input
              placeholder="Nome do badge"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddBadge()}
            />
            <Button onClick={handleAddBadge} disabled={!newBadge.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Predefined Badges */}
          <div>
            <Label className="text-sm text-muted-foreground">Badges predefinidos:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedBadges.map((badge) => (
                <Badge
                  key={badge}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addBadge(badge)}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Current Badges */}
          {badges.length > 0 && (
            <div>
              <Label className="text-sm">Badges selecionados:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge) => (
                  <Badge key={badge} className="pr-1">
                    {badge}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeBadge(badge)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};