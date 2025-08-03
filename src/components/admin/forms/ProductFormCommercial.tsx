import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductFormCommercialProps {
  form: UseFormReturn<any>;
}

export const ProductFormCommercial: React.FC<ProductFormCommercialProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Comerciais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="msrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MSRP (Preço Sugerido)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 15.000,00..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status de Disponibilidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Em produção, Descontinuado..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replacement_model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo Substituto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ref. 126610LV..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="box_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Caixa/Embalagem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Caixa de madeira, Estojo de couro..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentação Incluída</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Certificado de garantia, manual de instruções, cartão de autenticidade..."
                      className="min-h-[80px]"
                      {...field} 
                    />
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