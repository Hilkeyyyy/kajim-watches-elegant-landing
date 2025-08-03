import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductFormBasicSpecsProps {
  form: UseFormReturn<any>;
}

export const ProductFormBasicSpecs: React.FC<ProductFormBasicSpecsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Especificações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="movement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movimento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Quartzo, Automático, Manual..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caliber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calibre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cal. 2824-2, Cal. 4130..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="watch_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Relógio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dress Watch, Sports Watch, Diver..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coleção</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Submariner, Speedmaster..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Referência</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 116610LN, 311.30.42.30.01.005..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="production_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano de Produção</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2023, 2020-2024..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="jewels_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Rubis</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 25 rubis, 31 rubis..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency_hz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 28800 A/h, 21600 A/h..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="power_reserve"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reserva de Marcha</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 38 horas, 70 horas..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amplitude_degrees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amplitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 270°-315°, 250°-300°..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beat_error_ms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Erro de Batida</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ±0.5ms, ±1.0ms..." {...field} />
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