-- 1) Add JSONB column for flexible specs on products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS specs jsonb DEFAULT '{}'::jsonb;

-- Helpful index for querying specs keys/values
CREATE INDEX IF NOT EXISTS idx_products_specs_gin ON public.products USING GIN (specs);

-- 2) Relational table for ordered, grouped specifications
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  group_name text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_product_spec UNIQUE (product_id, group_name, key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prod_specs_product ON public.product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_prod_specs_group_order ON public.product_specifications(product_id, group_name, sort_order);

-- Enable RLS
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
  -- Super admin full access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'product_specifications' AND policyname = 'Super admin acesso total product_specifications'
  ) THEN
    CREATE POLICY "Super admin acesso total product_specifications"
    ON public.product_specifications
    FOR ALL
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));
  END IF;

  -- Admins manage all
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'product_specifications' AND policyname = 'Admins podem gerenciar product_specifications'
  ) THEN
    CREATE POLICY "Admins podem gerenciar product_specifications"
    ON public.product_specifications
    FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  END IF;

  -- Public can read (to render specs on PDP)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'product_specifications' AND policyname = 'Specs visíveis para todos'
  ) THEN
    CREATE POLICY "Specs visíveis para todos"
    ON public.product_specifications
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Trigger to keep updated_at fresh
CREATE TRIGGER trg_product_specifications_updated_at
BEFORE UPDATE ON public.product_specifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();