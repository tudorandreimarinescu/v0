-- Get category IDs for reference
WITH category_ids AS (
    SELECT 
        id as vfx_id,
        (SELECT id FROM categories WHERE slug = 'game-environment-shaders') as game_id,
        (SELECT id FROM categories WHERE slug = 'material-shaders') as material_id
    FROM categories WHERE slug = 'visual-effects-shaders'
)

-- Insert products
INSERT INTO products (id, slug, status, brand, material, specs, default_currency, base_price, category_id) 
SELECT 
    gen_random_uuid(),
    'cinematic-fire-shader-pack',
    'active',
    'ShaderCraft Studios',
    'HLSL/GLSL',
    '{"render_pipeline": "Universal RP", "shader_model": "4.0", "platforms": ["PC", "Console"], "file_formats": ["shader", "material"], "documentation": true}'::jsonb,
    'USD',
    49.99,
    vfx_id
FROM category_ids

UNION ALL

SELECT 
    gen_random_uuid(),
    'holographic-ui-effects',
    'active',
    'DigitalVision Labs',
    'HLSL',
    '{"render_pipeline": "Built-in RP", "shader_model": "3.5", "platforms": ["PC", "Mobile"], "file_formats": ["shader", "prefab"], "documentation": true}'::jsonb,
    'USD',
    29.99,
    vfx_id
FROM category_ids

UNION ALL

SELECT 
    gen_random_uuid(),
    'procedural-terrain-system',
    'active',
    'TerrainMaster Pro',
    'HLSL/Compute',
    '{"render_pipeline": "Universal RP", "shader_model": "5.0", "platforms": ["PC", "Console"], "file_formats": ["shader", "compute", "material"], "documentation": true}'::jsonb,
    'USD',
    79.99,
    game_id
FROM category_ids

UNION ALL

SELECT 
    gen_random_uuid(),
    'stylized-water-collection',
    'active',
    'AquaShaders Inc',
    'HLSL',
    '{"render_pipeline": "Universal RP", "shader_model": "4.0", "platforms": ["PC", "Mobile", "Console"], "file_formats": ["shader", "material", "texture"], "documentation": true}'::jsonb,
    'USD',
    39.99,
    game_id
FROM category_ids

UNION ALL

SELECT 
    gen_random_uuid(),
    'pbr-metal-collection',
    'active',
    'MaterialWorks',
    'PBR/HLSL',
    '{"render_pipeline": "Universal RP", "shader_model": "4.0", "platforms": ["PC", "Console"], "file_formats": ["shader", "material", "texture"], "documentation": true}'::jsonb,
    'USD',
    34.99,
    material_id
FROM category_ids

UNION ALL

SELECT 
    gen_random_uuid(),
    'fabric-shader-suite',
    'active',
    'TextureCraft Pro',
    'PBR/HLSL',
    '{"render_pipeline": "Universal RP", "shader_model": "4.0", "platforms": ["PC", "Mobile", "Console"], "file_formats": ["shader", "material", "texture"], "documentation": true}'::jsonb,
    'USD',
    44.99,
    material_id
FROM category_ids

ON CONFLICT (slug) DO NOTHING;
