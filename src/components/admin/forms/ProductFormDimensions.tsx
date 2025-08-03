import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductFormDimensionsProps {
  form: UseFormReturn<any>;
}

export const ProductFormDimensions: React.FC<ProductFormDimensionsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dimensões e Medidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="case_diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diâmetro da Caixa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 40mm, 42mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="case_height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura da Caixa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 12.5mm, 14mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="case_thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espessura da Caixa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 13mm, 15.5mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lug_to_lug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lug to Lug</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 48mm, 50mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lug_width_mm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largura da Alça</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 20mm, 22mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 150g, 180g..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="crown_diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diâmetro da Coroa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6mm, 8mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crystal_diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diâmetro do Cristal</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 30.5mm, 32mm..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bezel_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Luneta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Unidirecional, Bidirecional, Fixa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bracelet_width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largura da Pulseira</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 20mm, 22mm na alça..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bracelet_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprimento da Pulseira</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 175mm total, ajustável..." {...field} />
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