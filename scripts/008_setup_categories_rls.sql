-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for active categories" ON categories;
DROP POLICY IF EXISTS "Admin full access to categories" ON categories;

-- Allow public read access to active categories
CREATE POLICY "Public read access for active categories" ON categories
    FOR SELECT USING (is_active = true);

-- Allow admins full access to categories
CREATE POLICY "Admin full access to categories" ON categories
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
