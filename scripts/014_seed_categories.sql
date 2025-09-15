-- Insert categories for shader/digital art products
INSERT INTO categories (id, name, slug, description, sort_order, is_active, image_url) VALUES
(
    gen_random_uuid(),
    'Visual Effects Shaders',
    'visual-effects-shaders',
    'Professional shader packages for visual effects, particle systems, and cinematic rendering',
    1,
    true,
    '/placeholder.svg?height=300&width=400'
),
(
    gen_random_uuid(),
    'Game Environment Shaders',
    'game-environment-shaders',
    'Optimized shaders for game environments, terrain, water, and atmospheric effects',
    2,
    true,
    '/placeholder.svg?height=300&width=400'
),
(
    gen_random_uuid(),
    'Material Shaders',
    'material-shaders',
    'Realistic material shaders including metals, fabrics, glass, and organic surfaces',
    3,
    true,
    '/placeholder.svg?height=300&width=400'
)
ON CONFLICT (slug) DO NOTHING;
