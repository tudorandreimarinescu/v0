-- Create product translations table
CREATE TABLE IF NOT EXISTS product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  short_desc TEXT,
  long_desc TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, locale)
);

-- Enable RLS
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product translations
CREATE POLICY "Public can view translations for active products" ON product_translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_translations.product_id 
      AND products.status = 'active'
    )
  );

CREATE POLICY "Admins can manage product translations" ON product_translations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_translations_locale ON product_translations(locale);
