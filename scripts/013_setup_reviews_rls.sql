-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admin full access to reviews" ON reviews;

-- Allow public read access to approved reviews of active products
CREATE POLICY "Public read access for approved reviews" ON reviews
    FOR SELECT USING (
        status = 'approved' AND
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = reviews.product_id 
            AND products.status = 'active'
        )
    );

-- Allow authenticated users to create reviews
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (user_id = auth.uid() OR user_id IS NULL)
    );

-- Allow users to update their own reviews (only if pending)
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (
        auth.uid() = user_id AND status = 'pending'
    ) WITH CHECK (
        auth.uid() = user_id AND status = 'pending'
    );

-- Allow admins full access to reviews
CREATE POLICY "Admin full access to reviews" ON reviews
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
