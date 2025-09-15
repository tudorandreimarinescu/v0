-- Enable RLS on product_prices table
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active product prices" ON product_prices;
DROP POLICY IF EXISTS "Admin full access to product prices" ON product_prices;

-- Allow public read access to prices of active products
CREATE POLICY "Public read access for active product prices" ON product_prices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = product_prices.product_id 
            AND products.status = 'active'
        )
    );

-- Allow admins full access to product prices
CREATE POLICY "Admin full access to product prices" ON product_prices
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
