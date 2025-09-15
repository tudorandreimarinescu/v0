-- Seed sample reviews
DO $$
DECLARE
    headphones_id UUID;
    watch_id UUID;
    vase_id UUID;
    cutting_board_id UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO headphones_id FROM products WHERE slug = 'wireless-headphones';
    SELECT id INTO watch_id FROM products WHERE slug = 'smart-watch';
    SELECT id INTO vase_id FROM products WHERE slug = 'ceramic-vase';
    SELECT id INTO cutting_board_id FROM products WHERE slug = 'bamboo-cutting-board';

    -- Sample reviews
    INSERT INTO reviews (product_id, rating, title, body, status, reviewer_name, reviewer_email) VALUES
    (headphones_id, 5, 'Excellent Sound Quality', 'These headphones exceeded my expectations. The noise cancellation works perfectly and the battery life is amazing.', 'approved', 'Sarah Johnson', 'sarah.j@example.com'),
    (headphones_id, 4, 'Great for Travel', 'Perfect for long flights. Comfortable to wear for hours and the sound quality is top-notch.', 'approved', 'Mike Chen', 'mike.c@example.com'),
    (watch_id, 5, 'Perfect Fitness Companion', 'Love tracking my workouts with this watch. The health features are comprehensive and accurate.', 'approved', 'Emma Wilson', 'emma.w@example.com'),
    (watch_id, 4, 'Stylish and Functional', 'Great design and the battery really does last a week. Highly recommended!', 'approved', 'David Brown', 'david.b@example.com'),
    (vase_id, 5, 'Beautiful Addition to My Home', 'This vase is absolutely gorgeous. The craftsmanship is excellent and it looks perfect in my living room.', 'approved', 'Lisa Garcia', 'lisa.g@example.com'),
    (cutting_board_id, 4, 'Eco-Friendly and Practical', 'Love that this is made from sustainable bamboo. It''s the perfect size for my kitchen prep.', 'approved', 'Tom Anderson', 'tom.a@example.com')
    ON CONFLICT DO NOTHING;
END $$;
