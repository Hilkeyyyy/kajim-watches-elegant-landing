-- Criar tabela para itens do carrinho
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT cart_items_user_product_unique UNIQUE(user_id, product_id),
  CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0)
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Policies para cart_items
CREATE POLICY "Usuários podem ver seus próprios itens do carrinho" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem adicionar itens ao próprio carrinho" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios itens do carrinho" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover seus próprios itens do carrinho" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins podem gerenciar todos os carrinho
CREATE POLICY "Admins podem gerenciar todos os carrinhos" 
ON public.cart_items 
FOR ALL 
USING (is_admin(auth.uid()));

-- Trigger para update timestamp
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();