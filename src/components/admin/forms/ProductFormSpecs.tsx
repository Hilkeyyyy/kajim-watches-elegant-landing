import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductFormSpecsProps {
  form: UseFormReturn<any>;
}

export const ProductFormSpecs: React.FC<ProductFormSpecsProps> = ({ form }) => {
  const [openSections, setOpenSections] = useState({
    materials: true,
    dimensions: true,
    resistance: true,
    advanced: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Materiais */}
      <Collapsible open={openSections.materials} onOpenChange={() => toggleSection('materials')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                Materiais e Construção
                {openSections.materials ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material da Caixa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o material" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="stainless_steel">Aço Inoxidável</SelectItem>
                    <SelectItem value="titanium">Titânio</SelectItem>
                    <SelectItem value="gold">Ouro</SelectItem>
                    <SelectItem value="platinum">Platina</SelectItem>
                    <SelectItem value="ceramic">Cerâmica</SelectItem>
                    <SelectItem value="carbon_fiber">Fibra de Carbono</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de vidro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sapphire">Cristal de Safira</SelectItem>
                    <SelectItem value="mineral">Vidro Mineral</SelectItem>
                    <SelectItem value="acrylic">Acrílico</SelectItem>
                    <SelectItem value="hardlex">Hardlex</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="strap_material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material da Pulseira</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Material da pulseira" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="leather">Couro</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="rubber">Borracha</SelectItem>
                    <SelectItem value="silicone">Silicone</SelectItem>
                    <SelectItem value="fabric">Tecido</SelectItem>
                    <SelectItem value="nato">NATO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dial_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Mostrador</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Azul, Preto, Branco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Dimensões */}
      <Collapsible open={openSections.dimensions} onOpenChange={() => toggleSection('dimensions')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                Dimensões e Especificações
                {openSections.dimensions ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 180g" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espessura</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 12mm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lug_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largura das Alças</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 22mm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Resistência e Durabilidade */}
      <Collapsible open={openSections.resistance} onOpenChange={() => toggleSection('resistance')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                Resistência e Durabilidade
                {openSections.resistance ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="water_resistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resistência à Água</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Resistência à água" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30m">30m (3ATM)</SelectItem>
                    <SelectItem value="50m">50m (5ATM)</SelectItem>
                    <SelectItem value="100m">100m (10ATM)</SelectItem>
                    <SelectItem value="200m">200m (20ATM)</SelectItem>
                    <SelectItem value="300m">300m (30ATM)</SelectItem>
                    <SelectItem value="500m">500m (50ATM)</SelectItem>
                    <SelectItem value="1000m">1000m (100ATM)</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Período de garantia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1_year">1 Ano</SelectItem>
                    <SelectItem value="2_years">2 Anos</SelectItem>
                    <SelectItem value="3_years">3 Anos</SelectItem>
                    <SelectItem value="5_years">5 Anos</SelectItem>
                    <SelectItem value="lifetime">Vitalícia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Especificações Avançadas */}
      <Collapsible open={openSections.advanced} onOpenChange={() => toggleSection('advanced')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                Especificações Avançadas
                {openSections.advanced ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bezel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Moldura</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Unidirecional, Bidirecional" {...field} />
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
                      <Input placeholder="Ex: Fecho de segurança, Fivela" {...field} />
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
                    <FormLabel>Reserva de Energia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 48 horas, 72 horas" {...field} />
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
                      <Input placeholder="Ex: Suíça, Japão, Alemanha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};