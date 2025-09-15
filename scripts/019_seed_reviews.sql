-- Insert sample reviews for products
INSERT INTO reviews (id, product_id, user_id, rating, title, body, status, reviewer_name, reviewer_email)
SELECT 
    gen_random_uuid(),
    p.id,
    NULL,  -- Anonymous reviews
    5,
    'Absolutely stunning fire effects!',
    'These fire shaders are incredible. The realism and performance optimization is top-notch. Perfect for our cinematic project.',
    'approved',
    'Alex Chen',
    'alex.chen@example.com'
FROM products p
WHERE p.slug = 'cinematic-fire-shader-pack'

UNION ALL

SELECT 
    gen_random_uuid(),
    p.id,
    NULL,
    4,
    'Great for sci-fi UI',
    'Really love the holographic effects. Easy to implement and customize. Would love to see more color variations in future updates.',
    'approved',
    'Sarah Martinez',
    'sarah.m@example.com'
FROM products p
WHERE p.slug = 'holographic-ui-effects'

UNION ALL

SELECT 
    gen_random_uuid(),
    p.id,
    NULL,
    5,
    'Game-changing terrain system',
    'This procedural terrain system saved us months of development time. The LOD system works flawlessly and the editor integration is seamless.',
    'approved',
    'Mike Johnson',
    'mike.j@gamedev.com'
FROM products p
WHERE p.slug = 'procedural-terrain-system'

UNION ALL

SELECT 
    gen_random_uuid(),
    p.id,
    NULL,
    4,
    'Beautiful stylized water',
    'Perfect for our cartoon-style game. The water looks amazing and runs smoothly on mobile devices. Great documentation too.',
    'approved',
    'Emma Wilson',
    'emma.w@indiegames.com'
FROM products p
WHERE p.slug = 'stylized-water-collection'

UNION ALL

SELECT 
    gen_random_uuid(),
    p.id,
    NULL,
    5,
    'Realistic metal materials',
    'The PBR workflow is spot-on. These metal shaders look incredibly realistic under different lighting conditions. Highly recommended.',
    'approved',
    'David Kim',
    'david.kim@archviz.com'
FROM products p
WHERE p.slug = 'pbr-metal-collection'

UNION ALL

SELECT 
    gen_random_uuid(),
    p.id,
    NULL,
    4,
    'Comprehensive fabric collection',
    'Great variety of fabric types. The subsurface scattering on the silk shader is particularly impressive. Good value for money.',
    'approved',
    'Lisa Thompson',
    'lisa.t@fashion3d.com'
FROM products p
WHERE p.slug = 'fabric-shader-suite'

ON CONFLICT DO NOTHING;
