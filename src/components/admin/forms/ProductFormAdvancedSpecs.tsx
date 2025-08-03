import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProductFormAdvancedSpecsProps {
  form: UseFormReturn<any>;
}

export const ProductFormAdvancedSpecs: React.FC<ProductFormAdvancedSpecsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Especificações Avançadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resistências */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="water_resistance_meters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resistência à Água (metros)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 300m, 100m..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="water_resistance_atm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resistência à Água (ATM)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 30 ATM, 10 ATM..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="anti_magnetic_resistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resistência Antimagnética</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 15000 Gauss, 4800 A/m..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="shock_resistant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Resistente a Choques</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperature_resistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resistência à Temperatura</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: -10°C a +60°C..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Características Visuais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="indices_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Índices</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Aplicados, Gravados, Luminosos..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numerals_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Numerais</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Árabes, Romanos, Sem numerais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hands_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ponteiros</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mercedes, Dauphine, Baton..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lume_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Luminescência</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Super-LumiNova, Tritium..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Características Técnicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="crown_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Coroa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roscada, Push-pull, Tripla vedação..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="case_back"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Fundo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roscado, Pressure-fit, Display..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clasp_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Fecho</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Deployant, Fivela, Oysterclasp..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buckle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Fivela</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tang buckle, Deployment, Pin..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Certificações e Garantia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="certification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificações</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: COSC, Master Chronometer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2 anos internacional, 5 anos..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País de Origem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Suíça, Japão, Alemanha..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limited_edition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edição Limitada</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 1000 peças, numerado..." {...field} />
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