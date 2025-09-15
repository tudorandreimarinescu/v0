-- Enable RLS on product_translations table
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active product translations" ON product_translations;
DROP POLICY IF EXISTS "Admin full access to product translations" ON product_translations;

-- Allow public read access to translations of active products
CREATE POLICY "Public read access for active product translations" ON product_translations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = product_translations.product_id 
            AND products.status = 'active'
        )
    );

-- Allow admins full access to product translations
CREATE POLICY "Admin full access to product translations" ON product_translations
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
