-- Seed product prices in multiple currencies
DO $$
DECLARE
    product_record RECORD;
BEGIN
    FOR product_record IN SELECT id, base_price FROM products LOOP
        -- USD prices (base)
        INSERT INTO product_prices (product_id, currency, amount_minor) VALUES
        (product_record.id, 'USD', (product_record.base_price * 100)::INTEGER)
        ON CONFLICT (product_id, currency) DO NOTHING;
        
        -- EUR prices (approximate conversion)
        INSERT INTO product_prices (product_id, currency, amount_minor) VALUES
        (product_record.id, 'EUR', (product_record.base_price * 92)::INTEGER)
        ON CONFLICT (product_id, currency) DO NOTHING;
        
        -- GBP prices (approximate conversion)
        INSERT INTO product_prices (product_id, currency, amount_minor) VALUES
        (product_record.id, 'GBP', (product_record.base_price * 79)::INTEGER)
        ON CONFLICT (product_id, currency) DO NOTHING;
    END LOOP;
END $$;
