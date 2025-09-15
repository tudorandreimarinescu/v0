-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active products" ON products;
DROP POLICY IF EXISTS "Admin full access to products" ON products;

-- Allow public read access to active products
CREATE POLICY "Public read access for active products" ON products
    FOR SELECT USING (status = 'active');

-- Allow admins full access to products
CREATE POLICY "Admin full access to products" ON products
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
