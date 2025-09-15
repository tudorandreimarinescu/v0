-- Insert prices for all products in multiple currencies
INSERT INTO product_prices (id, product_id, currency, amount_minor)
SELECT 
    gen_random_uuid(),
    p.id,
    'USD',
    CASE p.slug
        WHEN 'cinematic-fire-shader-pack' THEN 4999  -- $49.99
        WHEN 'holographic-ui-effects' THEN 2999      -- $29.99
        WHEN 'procedural-terrain-system' THEN 7999   -- $79.99
        WHEN 'stylized-water-collection' THEN 3999   -- $39.99
        WHEN 'pbr-metal-collection' THEN 3499        -- $34.99
        WHEN 'fabric-shader-suite' THEN 4499         -- $44.99
    END
FROM products p
WHERE p.slug IN (
    'cinematic-fire-shader-pack',
    'holographic-ui-effects', 
    'procedural-terrain-system',
    'stylized-water-collection',
    'pbr-metal-collection',
    'fabric-shader-suite'
)

UNION ALL

-- Add EUR prices (approximately 0.85 conversion rate)
SELECT 
    gen_random_uuid(),
    p.id,
    'EUR',
    CASE p.slug
        WHEN 'cinematic-fire-shader-pack' THEN 4249  -- €42.49
        WHEN 'holographic-ui-effects' THEN 2549      -- €25.49
        WHEN 'procedural-terrain-system' THEN 6799   -- €67.99
        WHEN 'stylized-water-collection' THEN 3399   -- €33.99
        WHEN 'pbr-metal-collection' THEN 2974        -- €29.74
        WHEN 'fabric-shader-suite' THEN 3824         -- €38.24
    END
FROM products p
WHERE p.slug IN (
    'cinematic-fire-shader-pack',
    'holographic-ui-effects', 
    'procedural-terrain-system',
    'stylized-water-collection',
    'pbr-metal-collection',
    'fabric-shader-suite'
)

ON CONFLICT (product_id, currency) DO NOTHING;
