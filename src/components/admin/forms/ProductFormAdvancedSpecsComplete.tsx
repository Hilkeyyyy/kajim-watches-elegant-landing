import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';

interface ProductFormAdvancedSpecsCompleteProps {
  form: UseFormReturn<any>;
}

export const ProductFormAdvancedSpecsComplete: React.FC<ProductFormAdvancedSpecsCompleteProps> = ({ form }) => {
  return (
    <div className="space-y-8">
      {/* Informações do Modelo */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Informações do Modelo</h3>
          <p className="text-sm text-muted-foreground">Detalhes específicos do modelo</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Submariner, Speedmaster..." {...field} />
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
                <FormLabel>Linha</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Professional, GMT-Master..." {...field} />
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
                <FormLabel>Referência</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 116610LN, 311.30.42.30..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Caixa */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Caixa</h3>
          <p className="text-sm text-muted-foreground">Especificações da caixa do relógio</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="case_diameter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formato da Caixa</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Redonda, Quadrada, Retangular..." {...field} />
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
                <FormLabel>Espessura</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 12mm, 15mm..." {...field} />
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
                  <Input placeholder="Ex: Prata, Dourada, Preta..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="case_back"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acabamento da Caixa</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Polido, Escovado, PVD..." {...field} />
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
                <FormLabel>Tipo de Vidro</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Safira, Mineral, Acrílico..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Mostrador */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Mostrador</h3>
          <p className="text-sm text-muted-foreground">Características do mostrador</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dial_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Mostrador</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Preto, Branco, Azul..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="indices_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Índices</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Aplicados, Impressos, Luminosos..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subdials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdials</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 3 subdials, Cronógrafo..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_display"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exibição de Data</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 3h, 6h, Sem data..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timezone_display"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GMT</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Ponteiro GMT, Bezel GMT..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Pulseira/Correia */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Pulseira/Correia</h3>
          <p className="text-sm text-muted-foreground">Detalhes da pulseira ou correia</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="strap_material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Pulseira, Correia..." {...field} />
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
                <FormLabel>Material da Pulseira</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Aço, Couro, Borracha..." {...field} />
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
                  <Input placeholder="Ex: Prata, Marrom, Preta..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="buckle_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Fecho</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Fivela, Deployant, Oysterlock..." {...field} />
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
                <FormLabel>Comprimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 18-22cm, Ajustável..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Movimento Detalhado */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Movimento Detalhado</h3>
          <p className="text-sm text-muted-foreground">Especificações técnicas do movimento</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="caliber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calibre</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2824-2, 7750, Miyota 9015..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 28.800 vph, 21.600 vph..." {...field} />
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
                  <Input placeholder="Ex: 42h, 72h, 120h..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jewels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joias</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 25 joias, 31 joias..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="certification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificação do Movimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: COSC, Manufatura..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Funções Especiais */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Funções Especiais</h3>
          <p className="text-sm text-muted-foreground">Funcionalidades adicionais do relógio</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="chronograph_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cronógrafo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1/10s, 30 min, 12h..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="calendar_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alarme</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Alarme simples, Dual time..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bússola</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Digital, Analógica..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bezel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calculadora</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Régua de cálculo, Digital..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="special_features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taquímetro</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Escala 400, Bezel externo..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="limited_edition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telêmetro</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Escala 1000m, Interno..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Resistências */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Resistências</h3>
          <p className="text-sm text-muted-foreground">Resistências e durabilidade</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="shock_resistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resistência a Choques</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ISO 1413, Militar..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="anti_magnetic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resistência Magnética</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 4.800 A/m, Antimagnético..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="operating_temperature"
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
      </div>

      <Separator />

      {/* Certificações e Garantia */}
      <div className="space-y-6">
        <div className="pb-2">
          <h3 className="text-lg font-semibold">Certificações e Garantia</h3>
          <p className="text-sm text-muted-foreground">Certificações e períodos de garantia</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="watch_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificação COSC</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Sim, Não, Cronômetro..." {...field} />
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
                <FormLabel>Teste da Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Master Chronometer, Superlative..." {...field} />
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
                  <Input placeholder="Ex: 2 anos, 5 anos..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};