-- Enable RLS on product_variants table
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active product variants" ON product_variants;
DROP POLICY IF EXISTS "Admin full access to product variants" ON product_variants;

-- Allow public read access to variants of active products that are active
CREATE POLICY "Public read access for active product variants" ON product_variants
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = product_variants.product_id 
            AND products.status = 'active'
        )
    );

-- Allow admins full access to product variants
CREATE POLICY "Admin full access to product variants" ON product_variants
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
