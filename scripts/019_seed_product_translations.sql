-- Seed product translations
DO $$
DECLARE
    product_record RECORD;
BEGIN
    -- Add English translations for all products
    FOR product_record IN SELECT id, slug FROM products LOOP
        CASE product_record.slug
            WHEN 'wireless-headphones' THEN
                INSERT INTO product_translations (product_id, locale, name, short_desc, long_desc) VALUES
                (product_record.id, 'en', 'Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 'Experience superior sound quality with these premium wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design perfect for music lovers and professionals.')
                ON CONFLICT (product_id, locale) DO NOTHING;
            WHEN 'smart-watch' THEN
                INSERT INTO product_translations (product_id, locale, name, short_desc, long_desc) VALUES
                (product_record.id, 'en', 'Advanced Smart Watch', 'Feature-rich smartwatch for active lifestyles', 'Stay connected and track your fitness with this advanced smartwatch featuring OLED display, 7-day battery life, water resistance up to 50m, and comprehensive health monitoring capabilities.')
                ON CONFLICT (product_id, locale) DO NOTHING;
            WHEN 'ceramic-vase' THEN
                INSERT INTO product_translations (product_id, locale, name, short_desc, long_desc) VALUES
                (product_record.id, 'en', 'Elegant Ceramic Vase', 'Handcrafted ceramic vase for home decoration', 'Add elegance to your home with this beautifully handcrafted ceramic vase. Perfect for fresh or dried flowers, this 25cm tall vase features a timeless design that complements any interior style.')
                ON CONFLICT (product_id, locale) DO NOTHING;
            WHEN 'bamboo-cutting-board' THEN
                INSERT INTO product_translations (product_id, locale, name, short_desc, long_desc) VALUES
                (product_record.id, 'en', 'Eco-Friendly Bamboo Cutting Board', 'Sustainable bamboo cutting board for kitchen use', 'Prepare your meals on this eco-friendly bamboo cutting board. Made from sustainable bamboo with natural antimicrobial properties, this reversible board is perfect for all your food preparation needs.')
                ON CONFLICT (product_id, locale) DO NOTHING;
            WHEN 'cotton-t-shirt' THEN
                INSERT INTO product_translations (product_id, locale, name, short_desc, long_desc) VALUES
                (product_record.id, 'en', 'Organic Cotton T-Shirt', 'Comfortable organic cotton t-shirt', 'Enjoy ultimate comfort with this premium organic cotton t-shirt. Made from sustainably sourced materials with a regular fit, this versatile piece is perfect for everyday wear and easy to care for.')
                ON CONFLICT (product_id, locale) DO NOTHING;
            WHEN 'leather-wallet' THEN
                INSERT INTO product_translations (product_id, locale, name, short_desc, long_desc) VALUES
                (product_record.id, 'en', 'Premium Leather Wallet', 'Handcrafted genuine leather wallet', 'Carry your essentials in style with this premium handcrafted leather wallet. Featuring 8 card slots, a coin pocket, and RFID blocking technology for security, this wallet combines functionality with timeless elegance.')
                ON CONFLICT (product_id, locale) DO NOTHING;
        END CASE;
    END LOOP;
END $$;
