-- Insert English translations for all products
INSERT INTO product_translations (id, product_id, locale, name, short_desc, long_desc)
SELECT 
    gen_random_uuid(),
    p.id,
    'en',
    CASE p.slug
        WHEN 'cinematic-fire-shader-pack' THEN 'Cinematic Fire Shader Pack'
        WHEN 'holographic-ui-effects' THEN 'Holographic UI Effects'
        WHEN 'procedural-terrain-system' THEN 'Procedural Terrain System'
        WHEN 'stylized-water-collection' THEN 'Stylized Water Collection'
        WHEN 'pbr-metal-collection' THEN 'PBR Metal Collection'
        WHEN 'fabric-shader-suite' THEN 'Fabric Shader Suite'
    END,
    CASE p.slug
        WHEN 'cinematic-fire-shader-pack' THEN 'Professional fire and flame effects for cinematic rendering'
        WHEN 'holographic-ui-effects' THEN 'Futuristic holographic interface shaders and effects'
        WHEN 'procedural-terrain-system' THEN 'Advanced procedural terrain generation with LOD support'
        WHEN 'stylized-water-collection' THEN 'Beautiful stylized water shaders for games and visualization'
        WHEN 'pbr-metal-collection' THEN 'Physically based metal materials with realistic properties'
        WHEN 'fabric-shader-suite' THEN 'Comprehensive fabric and textile material shaders'
    END,
    CASE p.slug
        WHEN 'cinematic-fire-shader-pack' THEN 'Create stunning fire and flame effects with this professional shader pack. Includes realistic fire simulation, ember particles, heat distortion, and smoke effects. Perfect for cinematic sequences, explosions, and atmospheric lighting. Compatible with major rendering pipelines and includes comprehensive documentation with usage examples.'
        WHEN 'holographic-ui-effects' THEN 'Transform your user interfaces with cutting-edge holographic effects. This pack includes glitch effects, scan lines, data streams, and futuristic UI elements. Ideal for sci-fi games, AR/VR applications, and modern digital interfaces. Optimized for mobile and desktop platforms.'
        WHEN 'procedural-terrain-system' THEN 'Generate infinite, detailed terrains with this advanced procedural system. Features multi-layer texturing, automatic LOD generation, erosion simulation, and biome blending. Perfect for open-world games and large-scale environments. Includes editor tools and runtime generation capabilities.'
        WHEN 'stylized-water-collection' THEN 'Beautiful collection of stylized water shaders for various art styles. Includes cartoon water, crystal-clear lakes, flowing rivers, and animated ocean surfaces. Each shader is performance-optimized and includes customizable parameters for color, flow, and animation speed.'
        WHEN 'pbr-metal-collection' THEN 'Physically accurate metal materials including steel, aluminum, copper, gold, and weathered variants. Each material features proper metallic workflows, realistic roughness maps, and oxidation effects. Perfect for industrial scenes, jewelry, and architectural visualization.'
        WHEN 'fabric-shader-suite' THEN 'Comprehensive collection of fabric and textile shaders including cotton, silk, denim, leather, and synthetic materials. Features realistic fiber simulation, subsurface scattering, and fabric-specific lighting models. Ideal for character clothing, furniture, and interior design.'
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
ON CONFLICT (product_id, locale) DO NOTHING;
