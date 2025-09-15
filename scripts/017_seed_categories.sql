-- Seed categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Electronics', 'electronics', 'Latest electronic devices and gadgets', true),
('Home & Garden', 'home-garden', 'Everything for your home and garden', true),
('Fashion', 'fashion', 'Stylish clothing and accessories', true)
ON CONFLICT (slug) DO NOTHING;
