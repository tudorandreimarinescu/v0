-- Setup RLS policies for product-related tables

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable but only admins can modify
CREATE POLICY "products_public_select"
  ON public.products FOR SELECT
  USING (status = 'active');

CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable but only admins can modify
CREATE POLICY "categories_public_select"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on product_variants table
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Product variants are publicly readable but only admins can modify
CREATE POLICY "product_variants_public_select"
  ON public.product_variants FOR SELECT
  USING (is_active = true);

CREATE POLICY "product_variants_admin_all"
  ON public.product_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on product_prices table
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

-- Product prices are publicly readable but only admins can modify
CREATE POLICY "product_prices_public_select"
  ON public.product_prices FOR SELECT
  USING (true);

CREATE POLICY "product_prices_admin_all"
  ON public.product_prices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on product_translations table
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

-- Product translations are publicly readable but only admins can modify
CREATE POLICY "product_translations_public_select"
  ON public.product_translations FOR SELECT
  USING (true);

CREATE POLICY "product_translations_admin_all"
  ON public.product_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
