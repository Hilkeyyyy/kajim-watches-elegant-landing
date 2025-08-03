import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";

interface ProductFormColorsProps {
  form: UseFormReturn<any>;
}

export const ProductFormColors: React.FC<ProductFormColorsProps> = ({ form }) => {
  const [newDialColor, setNewDialColor] = useState("");
  
  const dialColors = form.watch("dial_colors") || [];

  const addDialColor = () => {
    if (newDialColor.trim() && !dialColors.includes(newDialColor.trim())) {
      const currentColors = form.getValues("dial_colors") || [];
      form.setValue("dial_colors", [...currentColors, newDialColor.trim()]);
      setNewDialColor("");
    }
  };

  const removeDialColor = (colorToRemove: string) => {
    const currentColors = form.getValues("dial_colors") || [];
    form.setValue("dial_colors", currentColors.filter(color => color !== colorToRemove));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cores e Acabamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cores Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dial_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Principal do Mostrador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Preto, Azul sunburst, Branco..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="case_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor da Caixa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço polido, Ouro rosa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cores Disponíveis do Mostrador */}
          <div className="space-y-3">
            <FormLabel>Cores Disponíveis do Mostrador</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar cor disponível..."
                value={newDialColor}
                onChange={(e) => setNewDialColor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDialColor())}
              />
              <Button type="button" onClick={addDialColor} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {dialColors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {dialColors.map((color: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeDialColor(color)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Outras Cores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bezel_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor da Luneta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Preto cerâmica, Azul..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hands_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor dos Ponteiros</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Preto, Dourado, Prateado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="markers_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor dos Marcadores</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dourado aplicado, Branco..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="strap_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor da Pulseira</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marrom couro, Preto NATO..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Acabamentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dial_pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Padrão do Mostrador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Sunburst, Guilloché, Liso..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dial_finish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acabamento do Mostrador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Brilhante, Fosco, Texturizado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};