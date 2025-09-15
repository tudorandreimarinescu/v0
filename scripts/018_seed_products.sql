-- Get category IDs for seeding
DO $$
DECLARE
    electronics_id UUID;
    home_garden_id UUID;
    fashion_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';
    SELECT id INTO home_garden_id FROM categories WHERE slug = 'home-garden';
    SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';

    -- Seed products
    INSERT INTO products (slug, status, brand, material, specs, category_id, base_price) VALUES
    ('wireless-headphones', 'active', 'AudioTech', 'Plastic, Metal', '{"battery_life": "30 hours", "connectivity": "Bluetooth 5.0", "noise_cancellation": true}', electronics_id, 199.99),
    ('smart-watch', 'active', 'TechWear', 'Aluminum, Silicone', '{"display": "OLED", "water_resistance": "50m", "battery_life": "7 days"}', electronics_id, 299.99),
    ('ceramic-vase', 'active', 'HomeArt', 'Ceramic', '{"height": "25cm", "diameter": "15cm", "dishwasher_safe": true}', home_garden_id, 89.99),
    ('bamboo-cutting-board', 'active', 'EcoKitchen', 'Bamboo', '{"dimensions": "40x30x2cm", "antimicrobial": true, "reversible": true}', home_garden_id, 45.99),
    ('cotton-t-shirt', 'active', 'ComfortWear', 'Organic Cotton', '{"fit": "regular", "care": "machine washable", "origin": "sustainable"}', fashion_id, 29.99),
    ('leather-wallet', 'active', 'CraftLeather', 'Genuine Leather', '{"card_slots": 8, "coin_pocket": true, "rfid_blocking": true}', fashion_id, 79.99)
    ON CONFLICT (slug) DO NOTHING;
END $$;
