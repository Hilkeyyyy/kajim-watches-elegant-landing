import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { BrazilianNumberInput } from "@/components/BrazilianNumberInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormPricesProps {
  form: UseFormReturn<any>;
}

export const ProductFormPrices: React.FC<ProductFormPricesProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço *</FormLabel>
                <FormControl>
                  <BrazilianNumberInput
                    type="currency"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Original (opcional)</FormLabel>
                <FormControl>
                  <BrazilianNumberInput
                    type="currency"
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
