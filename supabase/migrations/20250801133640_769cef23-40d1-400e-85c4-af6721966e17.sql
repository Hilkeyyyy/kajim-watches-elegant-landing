-- Criar enum para status dos produtos
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'out_of_stock');

-- Criar tabela de categorias (marcas)
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  images TEXT[],
  description TEXT,
  brand TEXT NOT NULL,
  model TEXT,
  movement TEXT,
  case_size TEXT,
  material TEXT,
  water_resistance TEXT,
  warranty TEXT,
  features TEXT[],
  category_id UUID REFERENCES public.categories(id),
  status product_status DEFAULT 'active',
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perfis de usuário para administração
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para categorias
CREATE POLICY "Categorias visíveis para todos" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Apenas admins podem gerenciar categorias" 
ON public.categories FOR ALL 
USING (public.is_admin(auth.uid()));

-- Políticas para produtos
CREATE POLICY "Produtos visíveis para todos" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Apenas admins podem gerenciar produtos" 
ON public.products FOR ALL 
USING (public.is_admin(auth.uid()));

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os perfis" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins podem gerenciar todos os perfis" 
ON public.profiles FOR ALL 
USING (public.is_admin(auth.uid()));

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir categorias iniciais baseadas nas marcas
INSERT INTO public.categories (name, description) VALUES
('KAJIM', 'Relógios de luxo KAJIM com design exclusivo e acabamento premium'),
('Rolex', 'Relógios Rolex - Símbolo de prestígio e precisão'),
('Patek Philippe', 'Relógios Patek Philippe - A mais alta relojoaria suíça'),
('Omega', 'Relógios Omega - Precisão e inovação'),
('TAG Heuer', 'Relógios TAG Heuer - Esportivos e elegantes'),
('Cartier', 'Relógios Cartier - Joalheria e relojoaria de luxo');