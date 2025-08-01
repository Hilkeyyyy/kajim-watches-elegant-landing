import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { X, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string;
}

export const ProductModal = ({ isOpen, onClose, onSuccess, productId }: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    price: '',
    description: '',
    collection: '',
    reference_number: '',
    limited_edition: '',
    production_year: '',
    
    // Movement specifications
    movement: '',
    jewels: '',
    frequency: '',
    amplitude: '',
    beat_error: '',
    power_reserve: '',
    complications: [] as string[],
    calendar_type: '',
    timezone_display: '',
    chronograph_type: '',
    subdials: '',
    
    // Case specifications
    case_size: '',
    material: '',
    thickness: '',
    weight: '',
    case_back: '',
    crown_type: '',
    pushers: '',
    bezel_type: '',
    lug_width: '',
    
    // Display specifications
    dial_color: '',
    hands_type: '',
    markers_type: '',
    glass_type: '',
    date_display: '',
    lume_type: '',
    luminosity: '',
    
    // Strap/Bracelet specifications
    strap_material: '',
    bracelet_type: '',
    clasp_type: '',
    buckle_type: '',
    
    // Resistance specifications
    water_resistance: '',
    shock_resistance: '',
    anti_magnetic: '',
    operating_temperature: '',
    altitude_resistance: '',
    pressure_resistance: '',
    vibration_resistance: '',
    
    // Additional specifications
    watch_type: '',
    certification: '',
    warranty: '',
    country_origin: '',
    special_features: [] as string[],
    
    // Stock and status
    stock_quantity: '',
    stock_status: 'in_stock',
    status: 'active',
    is_visible: true,
    is_featured: false,
    
    // Categories
    features: [] as string[],
    badges: [] as string[],
    custom_tags: [] as string[]
  });

  const [productImages, setProductImages] = useState<Array<{id: string, url: string, isMain: boolean}>>([]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    movement: false,
    case: false,
    display: false,
    strap: false,
    resistance: false,
    additional: false,
    features: false
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newComplication, setNewComplication] = useState('');
  const [newSpecialFeature, setNewSpecialFeature] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (productId) {
        fetchProduct();
      } else {
        resetForm();
      }
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      
      setFormData({
        name: data.name || '',
        brand: data.brand || '',
        model: data.model || '',
        price: data.price?.toString() || '',
        description: data.description || '',
        collection: data.collection || '',
        reference_number: data.reference_number || '',
        limited_edition: data.limited_edition || '',
        production_year: data.production_year || '',
        
        movement: data.movement || '',
        jewels: data.jewels || '',
        frequency: data.frequency || '',
        amplitude: data.amplitude || '',
        beat_error: data.beat_error || '',
        power_reserve: data.power_reserve || '',
        complications: data.complications || [],
        calendar_type: data.calendar_type || '',
        timezone_display: data.timezone_display || '',
        chronograph_type: data.chronograph_type || '',
        subdials: data.subdials || '',
        
        case_size: data.case_size || '',
        material: data.material || '',
        thickness: data.thickness || '',
        weight: data.weight || '',
        case_back: data.case_back || '',
        crown_type: data.crown_type || '',
        pushers: data.pushers || '',
        bezel_type: data.bezel_type || '',
        lug_width: data.lug_width || '',
        
        dial_color: data.dial_color || '',
        hands_type: data.hands_type || '',
        markers_type: data.markers_type || '',
        glass_type: data.glass_type || '',
        date_display: data.date_display || '',
        lume_type: data.lume_type || '',
        luminosity: data.luminosity || '',
        
        strap_material: data.strap_material || '',
        bracelet_type: data.bracelet_type || '',
        clasp_type: data.clasp_type || '',
        buckle_type: data.buckle_type || '',
        
        water_resistance: data.water_resistance || '',
        shock_resistance: data.shock_resistance || '',
        anti_magnetic: data.anti_magnetic || '',
        operating_temperature: data.operating_temperature || '',
        altitude_resistance: data.altitude_resistance || '',
        pressure_resistance: data.pressure_resistance || '',
        vibration_resistance: data.vibration_resistance || '',
        
        watch_type: data.watch_type || '',
        certification: data.certification || '',
        warranty: data.warranty || '',
        country_origin: data.country_origin || '',
        special_features: data.special_features || [],
        
        stock_quantity: data.stock_quantity?.toString() || '',
        stock_status: data.stock_status || 'in_stock',
        status: data.status || 'active',
        is_visible: data.is_visible ?? true,
        is_featured: data.is_featured ?? false,
        
        features: data.features || [],
        badges: data.badges || [],
        custom_tags: data.custom_tags || []
      });

      // Convert images from database format to component format
      if (data.images && Array.isArray(data.images)) {
        const imageObjects = data.images.map((url: string, index: number) => ({
          id: `existing-${index}`,
          url: url,
          isMain: index === 0
        }));
        setProductImages(imageObjects);
      } else if (data.image_url) {
        setProductImages([{
          id: 'main-image',
          url: data.image_url,
          isMain: true
        }]);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do produto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      price: '',
      description: '',
      collection: '',
      reference_number: '',
      limited_edition: '',
      production_year: '',
      
      movement: '',
      jewels: '',
      frequency: '',
      amplitude: '',
      beat_error: '',
      power_reserve: '',
      complications: [],
      calendar_type: '',
      timezone_display: '',
      chronograph_type: '',
      subdials: '',
      
      case_size: '',
      material: '',
      thickness: '',
      weight: '',
      case_back: '',
      crown_type: '',
      pushers: '',
      bezel_type: '',
      lug_width: '',
      
      dial_color: '',
      hands_type: '',
      markers_type: '',
      glass_type: '',
      date_display: '',
      lume_type: '',
      luminosity: '',
      
      strap_material: '',
      bracelet_type: '',
      clasp_type: '',
      buckle_type: '',
      
      water_resistance: '',
      shock_resistance: '',
      anti_magnetic: '',
      operating_temperature: '',
      altitude_resistance: '',
      pressure_resistance: '',
      vibration_resistance: '',
      
      watch_type: '',
      certification: '',
      warranty: '',
      country_origin: '',
      special_features: [],
      
      stock_quantity: '',
      stock_status: 'in_stock',
      status: 'active',
      is_visible: true,
      is_featured: false,
      
      features: [],
      badges: [],
      custom_tags: []
    });
    setProductImages([]);
    setNewFeature('');
    setNewBadge('');
    setNewTag('');
    setNewComplication('');
    setNewSpecialFeature('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = productImages.length > 0 ? productImages.map(img => img.url) : null;
      const mainImageUrl = productImages.find(img => img.isMain)?.url || productImages[0]?.url || null;

      const productData = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model || null,
        price: parseFloat(formData.price),
        description: formData.description || null,
        collection: formData.collection || null,
        reference_number: formData.reference_number || null,
        limited_edition: formData.limited_edition || null,
        production_year: formData.production_year || null,
        
        movement: formData.movement || null,
        jewels: formData.jewels || null,
        frequency: formData.frequency || null,
        amplitude: formData.amplitude || null,
        beat_error: formData.beat_error || null,
        power_reserve: formData.power_reserve || null,
        complications: formData.complications.length > 0 ? formData.complications : null,
        calendar_type: formData.calendar_type || null,
        timezone_display: formData.timezone_display || null,
        chronograph_type: formData.chronograph_type || null,
        subdials: formData.subdials || null,
        
        case_size: formData.case_size || null,
        material: formData.material || null,
        thickness: formData.thickness || null,
        weight: formData.weight || null,
        case_back: formData.case_back || null,
        crown_type: formData.crown_type || null,
        pushers: formData.pushers || null,
        bezel_type: formData.bezel_type || null,
        lug_width: formData.lug_width || null,
        
        dial_color: formData.dial_color || null,
        hands_type: formData.hands_type || null,
        markers_type: formData.markers_type || null,
        glass_type: formData.glass_type || null,
        date_display: formData.date_display || null,
        lume_type: formData.lume_type || null,
        luminosity: formData.luminosity || null,
        
        strap_material: formData.strap_material || null,
        bracelet_type: formData.bracelet_type || null,
        clasp_type: formData.clasp_type || null,
        buckle_type: formData.buckle_type || null,
        
        water_resistance: formData.water_resistance || null,
        shock_resistance: formData.shock_resistance || null,
        anti_magnetic: formData.anti_magnetic || null,
        operating_temperature: formData.operating_temperature || null,
        altitude_resistance: formData.altitude_resistance || null,
        pressure_resistance: formData.pressure_resistance || null,
        vibration_resistance: formData.vibration_resistance || null,
        
        watch_type: formData.watch_type || null,
        certification: formData.certification || null,
        warranty: formData.warranty || null,
        country_origin: formData.country_origin || null,
        special_features: formData.special_features.length > 0 ? formData.special_features : null,
        
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        stock_status: formData.stock_status,
        status: formData.status === 'draft' ? 'inactive' : formData.status as 'active' | 'inactive',
        is_visible: formData.is_visible,
        is_featured: formData.is_featured,
        
        image_url: mainImageUrl,
        images: imageUrls,
        features: formData.features.length > 0 ? formData.features : null,
        badges: formData.badges.length > 0 ? formData.badges : null,
        custom_tags: formData.custom_tags.length > 0 ? formData.custom_tags : null,
      };

      let error;
      if (productId) {
        ({ error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert(productData));
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: productId ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!"
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addItem = (field: string, value: string, setter: (value: string) => void) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (value.trim() && Array.isArray(currentArray) && !currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof formData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => addItem('features', newFeature, setNewFeature);
  const addBadge = () => addItem('badges', newBadge, setNewBadge);
  const addTag = () => addItem('custom_tags', newTag, setNewTag);
  const addComplication = () => addItem('complications', newComplication, setNewComplication);
  const addSpecialFeature = () => addItem('special_features', newSpecialFeature, setNewSpecialFeature);

  const removeFeature = (index: number) => removeItem('features', index);
  const removeBadge = (index: number) => removeItem('badges', index);
  const removeTag = (index: number) => removeItem('custom_tags', index);
  const removeComplication = (index: number) => removeItem('complications', index);
  const removeSpecialFeature = (index: number) => removeItem('special_features', index);

  const CollapsibleSection = ({ title, section, children }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <Collapsible open={expandedSections[section]} onOpenChange={() => toggleSection(section)}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-between w-full p-4 text-left">
          <h3 className="text-lg font-semibold">{title}</h3>
          {expandedSections[section] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {productId ? 'Editar Produto' : 'Adicionar Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <CollapsibleSection title="Informações Básicas" section="basic">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection">Coleção</Label>
                <Input
                  id="collection"
                  value={formData.collection}
                  onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_number">Número de Referência</Label>
                <Input
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="production_year">Ano de Produção</Label>
                <Input
                  id="production_year"
                  value={formData.production_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, production_year: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="limited_edition">Edição Limitada</Label>
                <Input
                  id="limited_edition"
                  value={formData.limited_edition}
                  onChange={(e) => setFormData(prev => ({ ...prev, limited_edition: e.target.value }))}
                  placeholder="Ex: 1000 unidades"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="min-h-[100px]"
              />
            </div>
          </CollapsibleSection>

          {/* Especificações do Movimento */}
          <CollapsibleSection title="Especificações do Movimento" section="movement">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="movement">Movimento</Label>
                <Input
                  id="movement"
                  value={formData.movement}
                  onChange={(e) => setFormData(prev => ({ ...prev, movement: e.target.value }))}
                  placeholder="Ex: Automático, Quartzo, Manual"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jewels">Rubis (Jewels)</Label>
                <Input
                  id="jewels"
                  value={formData.jewels}
                  onChange={(e) => setFormData(prev => ({ ...prev, jewels: e.target.value }))}
                  placeholder="Ex: 25 rubis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  placeholder="Ex: 28.800 vph"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amplitude">Amplitude</Label>
                <Input
                  id="amplitude"
                  value={formData.amplitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, amplitude: e.target.value }))}
                  placeholder="Ex: 285°"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beat_error">Erro de Batimento</Label>
                <Input
                  id="beat_error"
                  value={formData.beat_error}
                  onChange={(e) => setFormData(prev => ({ ...prev, beat_error: e.target.value }))}
                  placeholder="Ex: 0.3ms"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="power_reserve">Reserva de Energia</Label>
                <Input
                  id="power_reserve"
                  value={formData.power_reserve}
                  onChange={(e) => setFormData(prev => ({ ...prev, power_reserve: e.target.value }))}
                  placeholder="Ex: 42 horas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendar_type">Tipo de Calendário</Label>
                <Input
                  id="calendar_type"
                  value={formData.calendar_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, calendar_type: e.target.value }))}
                  placeholder="Ex: Perpétuo, Anual, Simples"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone_display">Display de Fuso Horário</Label>
                <Input
                  id="timezone_display"
                  value={formData.timezone_display}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone_display: e.target.value }))}
                  placeholder="Ex: GMT, UTC, Dual Time"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronograph_type">Tipo de Cronógrafo</Label>
                <Input
                  id="chronograph_type"
                  value={formData.chronograph_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, chronograph_type: e.target.value }))}
                  placeholder="Ex: Mono-pusher, Bi-compax"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdials">Subesferas</Label>
                <Input
                  id="subdials"
                  value={formData.subdials}
                  onChange={(e) => setFormData(prev => ({ ...prev, subdials: e.target.value }))}
                  placeholder="Ex: 3 subesferas"
                />
              </div>
            </div>

            {/* Complicações */}
            <div className="space-y-4 mt-6">
              <h4 className="font-medium">Complicações</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newComplication}
                    onChange={(e) => setNewComplication(e.target.value)}
                    placeholder="Ex: Tourbillon, Perpetual Calendar"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addComplication())}
                  />
                  <Button type="button" onClick={addComplication} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.complications.map((complication, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {complication}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeComplication(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Especificações da Caixa */}
          <CollapsibleSection title="Especificações da Caixa" section="case">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="case_size">Tamanho da Caixa</Label>
                <Input
                  id="case_size"
                  value={formData.case_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, case_size: e.target.value }))}
                  placeholder="Ex: 42mm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material da Caixa</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                  placeholder="Ex: Aço Inoxidável, Ouro, Titânio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thickness">Espessura</Label>
                <Input
                  id="thickness"
                  value={formData.thickness}
                  onChange={(e) => setFormData(prev => ({ ...prev, thickness: e.target.value }))}
                  placeholder="Ex: 12mm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Ex: 185g"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case_back">Fundo da Caixa</Label>
                <Input
                  id="case_back"
                  value={formData.case_back}
                  onChange={(e) => setFormData(prev => ({ ...prev, case_back: e.target.value }))}
                  placeholder="Ex: Transparente, Fechado, Exhibition"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crown_type">Tipo de Coroa</Label>
                <Input
                  id="crown_type"
                  value={formData.crown_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, crown_type: e.target.value }))}
                  placeholder="Ex: Rosqueada, Push-pull"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pushers">Pushers</Label>
                <Input
                  id="pushers"
                  value={formData.pushers}
                  onChange={(e) => setFormData(prev => ({ ...prev, pushers: e.target.value }))}
                  placeholder="Ex: 2 pushers rosqueados"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bezel_type">Tipo de Moldura</Label>
                <Input
                  id="bezel_type"
                  value={formData.bezel_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, bezel_type: e.target.value }))}
                  placeholder="Ex: Unidirecional, Bidirecional, Fixa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lug_width">Largura da Alça</Label>
                <Input
                  id="lug_width"
                  value={formData.lug_width}
                  onChange={(e) => setFormData(prev => ({ ...prev, lug_width: e.target.value }))}
                  placeholder="Ex: 22mm"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Especificações do Display */}
          <CollapsibleSection title="Especificações do Display" section="display">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dial_color">Cor do Mostrador</Label>
                <Input
                  id="dial_color"
                  value={formData.dial_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, dial_color: e.target.value }))}
                  placeholder="Ex: Preto, Branco, Azul"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hands_type">Tipo de Ponteiros</Label>
                <Input
                  id="hands_type"
                  value={formData.hands_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, hands_type: e.target.value }))}
                  placeholder="Ex: Dauphine, Baton, Sword"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="markers_type">Tipo de Marcadores</Label>
                <Input
                  id="markers_type"
                  value={formData.markers_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, markers_type: e.target.value }))}
                  placeholder="Ex: Aplicados, Impressos, Romanos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="glass_type">Tipo de Cristal</Label>
                <Input
                  id="glass_type"
                  value={formData.glass_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, glass_type: e.target.value }))}
                  placeholder="Ex: Safira, Mineral, Acrílico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_display">Display de Data</Label>
                <Input
                  id="date_display"
                  value={formData.date_display}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_display: e.target.value }))}
                  placeholder="Ex: 3h, 6h, Pointer Date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lume_type">Tipo de Luminescência</Label>
                <Input
                  id="lume_type"
                  value={formData.lume_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, lume_type: e.target.value }))}
                  placeholder="Ex: Super-LumiNova, Tritium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="luminosity">Duração da Luminescência</Label>
                <Input
                  id="luminosity"
                  value={formData.luminosity}
                  onChange={(e) => setFormData(prev => ({ ...prev, luminosity: e.target.value }))}
                  placeholder="Ex: 8 horas"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Especificações da Pulseira/Bracelete */}
          <CollapsibleSection title="Pulseira/Bracelete" section="strap">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strap_material">Material da Pulseira</Label>
                <Input
                  id="strap_material"
                  value={formData.strap_material}
                  onChange={(e) => setFormData(prev => ({ ...prev, strap_material: e.target.value }))}
                  placeholder="Ex: Couro, Aço, Borracha, NATO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bracelet_type">Tipo de Bracelete</Label>
                <Input
                  id="bracelet_type"
                  value={formData.bracelet_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, bracelet_type: e.target.value }))}
                  placeholder="Ex: Oyster, Jubilee, Milanese"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clasp_type">Tipo de Fecho</Label>
                <Input
                  id="clasp_type"
                  value={formData.clasp_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, clasp_type: e.target.value }))}
                  placeholder="Ex: Fivela, Borboleta, Deployment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buckle_type">Tipo de Fivela</Label>
                <Input
                  id="buckle_type"
                  value={formData.buckle_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, buckle_type: e.target.value }))}
                  placeholder="Ex: Tang, Pin, Ardillon"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Especificações de Resistência */}
          <CollapsibleSection title="Resistência e Durabilidade" section="resistance">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="water_resistance">Resistência à Água</Label>
                <Input
                  id="water_resistance"
                  value={formData.water_resistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, water_resistance: e.target.value }))}
                  placeholder="Ex: 100m, 300m, 500m"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shock_resistance">Resistência a Choques</Label>
                <Input
                  id="shock_resistance"
                  value={formData.shock_resistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, shock_resistance: e.target.value }))}
                  placeholder="Ex: ISO 1413, DIN 8319"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anti_magnetic">Resistência Antimagnética</Label>
                <Input
                  id="anti_magnetic"
                  value={formData.anti_magnetic}
                  onChange={(e) => setFormData(prev => ({ ...prev, anti_magnetic: e.target.value }))}
                  placeholder="Ex: 15.000 Gauss, ISO 764"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operating_temperature">Temperatura de Operação</Label>
                <Input
                  id="operating_temperature"
                  value={formData.operating_temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, operating_temperature: e.target.value }))}
                  placeholder="Ex: -20°C a +60°C"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altitude_resistance">Resistência à Altitude</Label>
                <Input
                  id="altitude_resistance"
                  value={formData.altitude_resistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, altitude_resistance: e.target.value }))}
                  placeholder="Ex: 4.000m acima do nível do mar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure_resistance">Resistência à Pressão</Label>
                <Input
                  id="pressure_resistance"
                  value={formData.pressure_resistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, pressure_resistance: e.target.value }))}
                  placeholder="Ex: 30 bar, 300 ATM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibration_resistance">Resistência à Vibração</Label>
                <Input
                  id="vibration_resistance"
                  value={formData.vibration_resistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, vibration_resistance: e.target.value }))}
                  placeholder="Ex: ISO 3158"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Informações Adicionais */}
          <CollapsibleSection title="Informações Adicionais" section="additional">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="watch_type">Tipo de Relógio</Label>
                <Select
                  value={formData.watch_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, watch_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dress">Social (Dress)</SelectItem>
                    <SelectItem value="sport">Esportivo (Sport)</SelectItem>
                    <SelectItem value="dive">Mergulho (Dive)</SelectItem>
                    <SelectItem value="pilot">Aviador (Pilot)</SelectItem>
                    <SelectItem value="field">Campo (Field)</SelectItem>
                    <SelectItem value="racing">Corrida (Racing)</SelectItem>
                    <SelectItem value="gmt">GMT/Travel</SelectItem>
                    <SelectItem value="skeleton">Skeleton</SelectItem>
                    <SelectItem value="smartwatch">Smartwatch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification">Certificações</Label>
                <Input
                  id="certification"
                  value={formData.certification}
                  onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                  placeholder="Ex: COSC, METAS, Observatory"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Garantia</Label>
                <Input
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                  placeholder="Ex: 2 anos internacional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_origin">País de Origem</Label>
                <Input
                  id="country_origin"
                  value={formData.country_origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, country_origin: e.target.value }))}
                  placeholder="Ex: Suíça, Japão, Alemanha"
                />
              </div>
            </div>

            {/* Características Especiais */}
            <div className="space-y-4 mt-6">
              <h4 className="font-medium">Características Especiais</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSpecialFeature}
                    onChange={(e) => setNewSpecialFeature(e.target.value)}
                    placeholder="Ex: Moonphase, Power Reserve Indicator"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialFeature())}
                  />
                  <Button type="button" onClick={addSpecialFeature} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.special_features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeSpecialFeature(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Status e Configurações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="stock_status">Status do Estoque</Label>
                <Select
                  value={formData.stock_status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, stock_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">Em Estoque</SelectItem>
                    <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                    <SelectItem value="out_of_stock">Esgotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status do Produto</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                  />
                  <Label htmlFor="is_visible">Visível no site</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  />
                  <Label htmlFor="is_featured">Produto em destaque</Label>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Imagens */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imagens do Produto</h3>
            <MultipleImageUpload
              images={productImages}
              onImagesChange={setProductImages}
              maxImages={10}
              maxSizeInMB={5}
            />
          </div>

          {/* Características, Badges e Tags */}
          <CollapsibleSection title="Características, Badges e Tags" section="features">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Características */}
              <div className="space-y-4">
                <h4 className="font-medium">Características</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Nova característica"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-4">
                <h4 className="font-medium">Badges</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="Novo badge"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                    />
                    <Button type="button" onClick={addBadge} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {formData.badges.map((badge, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {badge}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeBadge(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h4 className="font-medium">Tags</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nova tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {formData.custom_tags.map((tag, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? 'Salvando...' : (productId ? 'Atualizar' : 'Criar')} Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};