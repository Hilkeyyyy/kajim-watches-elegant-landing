import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductFormBadgesProps {
  badges: string[];
  addBadge: (badge: string) => void;
  removeBadge: (badge: string) => void;
}

export const ProductFormBadges: React.FC<ProductFormBadgesProps> = ({ badges, addBadge, removeBadge }) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Badges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {badges.length > 0 && (
          <div>
            <Label className="text-sm">Selecionados:</Label>
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
  );
};
