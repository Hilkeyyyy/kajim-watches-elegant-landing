
import { supabase } from '@/integrations/supabase/client';
import { Product, CartItem, User, Category, ProductFilters, ApiResponse } from '@/types';
import { SupabaseProduct, convertSupabaseToProduct, convertProductToSupabase } from '@/types/supabase-product';

class ApiService {
  // PRODUTOS
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (filters?.brand) {
        query = query.eq('brand', filters.brand);
      }
      
      if (filters?.is_featured) {
        query = query.eq('is_featured', true);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters?.price_min) {
        query = query.gte('price', filters.price_min);
      }
      
      if (filters?.price_max) {
        query = query.lte('price', filters.price_max);
      }

      const { data, error } = await query;

      if (error) throw error;

      const convertedProducts = data?.map(item => convertSupabaseToProduct(item as SupabaseProduct)) || [];
      
      return {
        data: convertedProducts,
        success: true
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return {
        data: [],
        error: 'Erro ao carregar produtos',
        success: false
      };
    }
  }

  async getProduct(id: string): Promise<ApiResponse<Product | null>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      const convertedProduct = data ? convertSupabaseToProduct(data as SupabaseProduct) : null;
      
      return {
        data: convertedProduct,
        success: true
      };
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return {
        data: null,
        error: 'Produto não encontrado',
        success: false
      };
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    try {
      const supabaseProduct = convertProductToSupabase(product);
      
      const { data, error } = await supabase
        .from('products')
        .insert([supabaseProduct])
        .select()
        .single();

      if (error) throw error;

      const convertedProduct = convertSupabaseToProduct(data as SupabaseProduct);
      
      return {
        data: convertedProduct,
        success: true
      };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return {
        data: null as any,
        error: 'Erro ao criar produto',
        success: false
      };
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const supabaseUpdates = convertProductToSupabase(updates);
      
      const { data, error } = await supabase
        .from('products')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const convertedProduct = convertSupabaseToProduct(data as SupabaseProduct);
      
      return {
        data: convertedProduct,
        success: true
      };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return {
        data: null as any,
        error: 'Erro ao atualizar produto',
        success: false
      };
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        data: true,
        success: true
      };
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return {
        data: false,
        error: 'Erro ao deletar produto',
        success: false
      };
    }
  }

  // CATEGORIAS
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      return {
        data: data || [],
        success: true
      };
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return {
        data: [],
        error: 'Erro ao carregar categorias',
        success: false
      };
    }
  }

  // AUTENTICAÇÃO
  async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) throw new Error('Usuário não encontrado');

      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name,
        role: (profile?.role as 'user' | 'admin') || 'user',
        created_at: data.user.created_at
      };

      return {
        data: user,
        success: true
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        data: null as any,
        error: 'Email ou senha incorretos',
        success: false
      };
    }
  }

  async signOut(): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return {
        data: true,
        success: true
      };
    } catch (error) {
      console.error('Erro no logout:', error);
      return {
        data: false,
        error: 'Erro ao fazer logout',
        success: false
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;
      if (!user) return { data: null, success: true };

      // Buscar perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const userData: User = {
        id: user.id,
        email: user.email!,
        name: profile?.name,
        role: (profile?.role as 'user' | 'admin') || 'user',
        created_at: user.created_at
      };

      return {
        data: userData,
        success: true
      };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return {
        data: null,
        error: 'Erro ao verificar autenticação',
        success: false
      };
    }
  }
}

export const apiService = new ApiService();
