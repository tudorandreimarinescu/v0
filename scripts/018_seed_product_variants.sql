-- Insert product variants for different shader formats and platforms
INSERT INTO product_variants (id, product_id, sku, attributes, stock, price_adjustment, is_active)
SELECT 
    gen_random_uuid(),
    p.id,
    p.slug || '-unity-urp',
    '{"format": "Unity URP", "platform": "Unity", "version": "2022.3+"}'::jsonb,
    100,
    0.00,
    true
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

SELECT 
    gen_random_uuid(),
    p.id,
    p.slug || '-unreal-engine',
    '{"format": "Unreal Engine", "platform": "UE5", "version": "5.1+"}'::jsonb,
    100,
    5.00,  -- $5 premium for UE5 version
    true
FROM products p
WHERE p.slug IN (
    'cinematic-fire-shader-pack',
    'procedural-terrain-system',
    'stylized-water-collection',
    'pbr-metal-collection',
    'fabric-shader-suite'
)

UNION ALL

SELECT 
    gen_random_uuid(),
    p.id,
    p.slug || '-source-code',
    '{"format": "Source Code", "platform": "Multi-platform", "includes": ["HLSL", "GLSL", "Documentation"]}'::jsonb,
    50,
    15.00,  -- $15 premium for source code
    true
FROM products p
WHERE p.slug IN (
    'cinematic-fire-shader-pack',
    'holographic-ui-effects',
    'procedural-terrain-system'
)

ON CONFLICT (sku) DO NOTHING;
