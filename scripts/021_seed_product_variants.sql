-- Seed product variants
DO $$
DECLARE
    headphones_id UUID;
    watch_id UUID;
    tshirt_id UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO headphones_id FROM products WHERE slug = 'wireless-headphones';
    SELECT id INTO watch_id FROM products WHERE slug = 'smart-watch';
    SELECT id INTO tshirt_id FROM products WHERE slug = 'cotton-t-shirt';

    -- Headphones variants (colors)
    INSERT INTO product_variants (product_id, sku, attributes, stock, price_adjustment) VALUES
    (headphones_id, 'WH-001-BLK', '{"color": "Black"}', 50, 0),
    (headphones_id, 'WH-001-WHT', '{"color": "White"}', 30, 0),
    (headphones_id, 'WH-001-SLV', '{"color": "Silver"}', 25, 10.00)
    ON CONFLICT (sku) DO NOTHING;

    -- Smart watch variants (colors and sizes)
    INSERT INTO product_variants (product_id, sku, attributes, stock, price_adjustment) VALUES
    (watch_id, 'SW-001-BLK-42', '{"color": "Black", "size": "42mm"}', 40, 0),
    (watch_id, 'SW-001-BLK-46', '{"color": "Black", "size": "46mm"}', 35, 50.00),
    (watch_id, 'SW-001-SLV-42', '{"color": "Silver", "size": "42mm"}', 30, 25.00)
    ON CONFLICT (sku) DO NOTHING;

    -- T-shirt variants (sizes and colors)
    INSERT INTO product_variants (product_id, sku, attributes, stock, price_adjustment) VALUES
    (tshirt_id, 'TS-001-BLK-S', '{"color": "Black", "size": "S"}', 100, 0),
    (tshirt_id, 'TS-001-BLK-M', '{"color": "Black", "size": "M"}', 120, 0),
    (tshirt_id, 'TS-001-BLK-L', '{"color": "Black", "size": "L"}', 80, 0),
    (tshirt_id, 'TS-001-WHT-S', '{"color": "White", "size": "S"}', 90, 0),
    (tshirt_id, 'TS-001-WHT-M', '{"color": "White", "size": "M"}', 110, 0),
    (tshirt_id, 'TS-001-WHT-L', '{"color": "White", "size": "L"}', 75, 0)
    ON CONFLICT (sku) DO NOTHING;
END $$;
