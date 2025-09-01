import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';

interface BrandCategory {
  id?: string;
  brand_name: string;
  display_name: string;
  description?: string;
  custom_image_url?: string;
  sort_order: number;
  is_featured: boolean;
  is_visible: boolean;
  auto_generated: boolean;
  product_count?: number;
  default_image_url?: string;
}

export const useBrandCategories = () => {
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const generateCategoriesFromProducts = async () => {
    try {
      // Buscar produtos únicos por marca
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('brand, image_url')
        .eq('is_visible', true)
        .eq('status', 'active');

      if (productsError) throw productsError;

      // Agrupar por marca e contar produtos
      const brandCounts = products?.reduce((acc: Record<string, { count: number, image?: string }>, product) => {
        const brand = product.brand;
        if (!acc[brand]) {
          acc[brand] = { count: 0, image: product.image_url };
        }
        acc[brand].count += 1;
        if (!acc[brand].image && product.image_url) {
          acc[brand].image = product.image_url;
        }
        return acc;
      }, {});

      // Verificar quais marcas já existem na tabela brand_categories
      const { data: existingCategories, error: categoriesError } = await supabase
        .from('brand_categories')
        .select('brand_name');

      if (categoriesError) throw categoriesError;

      const existingBrands = new Set(existingCategories?.map(cat => cat.brand_name) || []);

      // Criar categorias automáticas para marcas que não existem
      const newCategories = Object.entries(brandCounts || {})
        .filter(([brand]) => !existingBrands.has(brand))
        .map(([brand, data]) => ({
          brand_name: brand,
          display_name: brand,
          description: `Coleção ${brand}`,
          custom_image_url: data.image,
          sort_order: 0,
          is_featured: false,
          is_visible: true,
          auto_generated: true
        }));

      // Importante: não recriar categorias excluídas automaticamente
      // Para evitar que categorias reapareçam após exclusão, não inserimos novas categorias aqui.
      // Apenas retornamos as contagens detectadas a partir dos produtos.

      return brandCounts;
    } catch (error) {
      handleError(error, 'Erro ao gerar categorias automaticamente');
      return {};
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      // Gerar categorias automáticas primeiro
      const productCounts = await generateCategoriesFromProducts();

      // Buscar todas as categorias visíveis
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Combinar com contagens de produtos e filtrar apenas categorias com produtos
      const categoriesWithCounts = (data || [])
        .map(category => ({
          ...category,
          product_count: productCounts[category.brand_name]?.count || 0,
          default_image_url: productCounts[category.brand_name]?.image
        }))
        .filter(category => category.product_count > 0); // Só mostrar categorias com produtos

      setCategories(categoriesWithCounts);
    } catch (error) {
      handleError(error, 'Erro ao carregar categorias de marca');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Real-time updates for brand_categories and products
    const categoriesChannel = supabase
      .channel('brand_categories_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brand_categories' }, () => {
        fetchCategories();
      })
      .subscribe();

    const productsChannel = supabase
      .channel('products_brand_watch')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, async () => {
        await generateCategoriesFromProducts();
        await fetchCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  return {
    categories,
    isLoading,
    refetch: fetchCategories,
    generateCategoriesFromProducts
  };
};