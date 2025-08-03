import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductFormMaterialsProps {
  form: UseFormReturn<any>;
}

export const ProductFormMaterials: React.FC<ProductFormMaterialsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Materiais e Construção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="case_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material da Caixa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço inoxidável 316L, Ouro 18k..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bezel_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material da Luneta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cerâmica, Aço, Alumínio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crystal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cristal</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Safira com AR, Mineral..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="glass_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vidro</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cristal de safira, Hesalite..." {...field} />
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
              name="dial_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material do Mostrador</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Madrepérola, Metal sunburst..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hands_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material dos Ponteiros</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço polido, Ouro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crown_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material da Coroa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço roscada, Ouro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caseback_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material do Fundo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço roscado, Cristal de safira..." {...field} />
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
              name="strap_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material da Pulseira</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Couro italiano, NATO, Aço..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bracelet_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material do Bracelete</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço escovado, Titânio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clasp_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material do Fecho</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aço com micro ajuste..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indices_material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material dos Índices</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ouro aplicado, Aço..." {...field} />
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