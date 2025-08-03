import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface ProductFormFeaturesProps {
  form: UseFormReturn<any>;
}

export const ProductFormFeatures: React.FC<ProductFormFeaturesProps> = ({ form }) => {
  const [newFeature, setNewFeature] = useState("");
  
  const features = form.watch("features") || [];
  
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      form.setValue("features", updatedFeatures);
      setNewFeature("");
    }
  };
  
  const removeFeature = (featureToRemove: string) => {
    const updatedFeatures = features.filter((feature: string) => feature !== featureToRemove);
    form.setValue("features", updatedFeatures);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Características do Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Feature */}
        <div className="space-y-2">
          <FormLabel>Adicionar Característica</FormLabel>
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ex: Cronógrafo, Data, Resistente a riscos..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addFeature}
              disabled={!newFeature.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Features */}
        {features.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Características Adicionadas</FormLabel>
            <div className="flex flex-wrap gap-2">
              {features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeFeature(feature)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {features.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma característica adicionada ainda.</p>
            <p className="text-sm">Use o campo acima para adicionar características do produto.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};