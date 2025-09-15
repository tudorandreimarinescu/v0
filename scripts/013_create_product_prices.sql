-- Create product prices table
CREATE TABLE IF NOT EXISTS product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount_minor INTEGER NOT NULL, -- Price in smallest currency unit (cents, pence, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, currency)
);

-- Enable RLS
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product prices
CREATE POLICY "Public can view prices for active products" ON product_prices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_prices.product_id 
      AND products.status = 'active'
    )
  );

CREATE POLICY "Admins can manage product prices" ON product_prices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_currency ON product_prices(currency);
