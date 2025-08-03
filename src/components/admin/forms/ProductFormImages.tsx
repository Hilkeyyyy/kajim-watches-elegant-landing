import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Image } from "lucide-react";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormImagesProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  badges: string[];
  addBadge: (badge: string) => void;
  removeBadge: (badge: string) => void;
}

export const ProductFormImages: React.FC<ProductFormImagesProps> = ({
  images,
  onImagesChange,
  badges,
  addBadge,
  removeBadge
}) => {
  const [newBadge, setNewBadge] = useState("");

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
            <Image className="h-5 w-5" />
            Imagens do Produto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload
            images={images}
            onImagesChange={onImagesChange}
            maxImages={10}
            maxSizeInMB={5}
          />
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