-- Create database functions for e-commerce operations

-- Function to get products with localized content and pricing
CREATE OR REPLACE FUNCTION get_products_with_details(
  p_locale TEXT DEFAULT 'en',
  p_currency TEXT DEFAULT 'USD',
  p_category_id UUID DEFAULT NULL,
  p_min_price NUMERIC DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL,
  p_search_term TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'created_at',
  p_sort_order TEXT DEFAULT 'DESC',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  brand TEXT,
  material TEXT,
  status TEXT,
  image_url TEXT,
  base_price NUMERIC,
  localized_price NUMERIC,
  currency TEXT,
  category_id UUID,
  category_name TEXT,
  name TEXT,
  short_desc TEXT,
  long_desc TEXT,
  specs JSONB,
  stock INTEGER,
  avg_rating NUMERIC,
  review_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.brand,
    p.material,
    p.status,
    p.image_url,
    p.base_price,
    CASE 
      WHEN fx.rate IS NOT NULL THEN p.base_price * fx.rate
      ELSE p.base_price
    END as localized_price,
    p_currency as currency,
    p.category_id,
    c.name as category_name,
    COALESCE(pt.name, 'Untitled Product') as name,
    COALESCE(pt.short_desc, '') as short_desc,
    COALESCE(pt.long_desc, '') as long_desc,
    p.specs,
    COALESCE(pv.stock, 0) as stock,
    COALESCE(r.avg_rating, 0) as avg_rating,
    COALESCE(r.review_count, 0) as review_count,
    p.created_at
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.locale = p_locale
  LEFT JOIN fx_rates fx ON fx.from_currency = p.default_currency 
    AND fx.to_currency = p_currency 
    AND fx.effective_date = (
      SELECT MAX(effective_date) 
      FROM fx_rates 
      WHERE from_currency = p.default_currency 
      AND to_currency = p_currency
    )
  LEFT JOIN (
    SELECT 
      product_id,
      SUM(stock) as stock
    FROM product_variants 
    WHERE is_active = true
    GROUP BY product_id
  ) pv ON p.id = pv.product_id
  LEFT JOIN (
    SELECT 
      product_id,
      AVG(rating::NUMERIC) as avg_rating,
      COUNT(*) as review_count
    FROM reviews 
    WHERE status = 'approved'
    GROUP BY product_id
  ) r ON p.id = r.product_id
  WHERE 
    p.status = 'active'
    AND (p_category_id IS NULL OR p.category_id = p_category_id)
    AND (p_min_price IS NULL OR p.base_price >= p_min_price)
    AND (p_max_price IS NULL OR p.base_price <= p_max_price)
    AND (p_search_term IS NULL OR 
         pt.name ILIKE '%' || p_search_term || '%' OR 
         pt.short_desc ILIKE '%' || p_search_term || '%' OR
         p.brand ILIKE '%' || p_search_term || '%')
  ORDER BY 
    CASE WHEN p_sort_by = 'price' AND p_sort_order = 'ASC' THEN p.base_price END ASC,
    CASE WHEN p_sort_by = 'price' AND p_sort_order = 'DESC' THEN p.base_price END DESC,
    CASE WHEN p_sort_by = 'name' AND p_sort_order = 'ASC' THEN pt.name END ASC,
    CASE WHEN p_sort_by = 'name' AND p_sort_order = 'DESC' THEN pt.name END DESC,
    CASE WHEN p_sort_by = 'rating' AND p_sort_order = 'DESC' THEN r.avg_rating END DESC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'DESC' THEN p.created_at END DESC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'ASC' THEN p.created_at END ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get product details by slug
CREATE OR REPLACE FUNCTION get_product_by_slug(
  p_slug TEXT,
  p_locale TEXT DEFAULT 'en',
  p_currency TEXT DEFAULT 'USD'
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  brand TEXT,
  material TEXT,
  status TEXT,
  image_url TEXT,
  base_price NUMERIC,
  localized_price NUMERIC,
  currency TEXT,
  category_id UUID,
  category_name TEXT,
  name TEXT,
  short_desc TEXT,
  long_desc TEXT,
  specs JSONB,
  variants JSONB,
  avg_rating NUMERIC,
  review_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.brand,
    p.material,
    p.status,
    p.image_url,
    p.base_price,
    CASE 
      WHEN fx.rate IS NOT NULL THEN p.base_price * fx.rate
      ELSE p.base_price
    END as localized_price,
    p_currency as currency,
    p.category_id,
    c.name as category_name,
    COALESCE(pt.name, 'Untitled Product') as name,
    COALESCE(pt.short_desc, '') as short_desc,
    COALESCE(pt.long_desc, '') as long_desc,
    p.specs,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', pv.id,
          'sku', pv.sku,
          'attributes', pv.attributes,
          'stock', pv.stock,
          'price_adjustment', pv.price_adjustment,
          'is_active', pv.is_active
        )
      ) FROM product_variants pv WHERE pv.product_id = p.id AND pv.is_active = true),
      '[]'::jsonb
    ) as variants,
    COALESCE(r.avg_rating, 0) as avg_rating,
    COALESCE(r.review_count, 0) as review_count,
    p.created_at
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.locale = p_locale
  LEFT JOIN fx_rates fx ON fx.from_currency = p.default_currency 
    AND fx.to_currency = p_currency 
    AND fx.effective_date = (
      SELECT MAX(effective_date) 
      FROM fx_rates 
      WHERE from_currency = p.default_currency 
      AND to_currency = p_currency
    )
  LEFT JOIN (
    SELECT 
      product_id,
      AVG(rating::NUMERIC) as avg_rating,
      COUNT(*) as review_count
    FROM reviews 
    WHERE status = 'approved'
    GROUP BY product_id
  ) r ON p.id = r.product_id
  WHERE p.slug = p_slug AND p.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to get categories with product counts
CREATE OR REPLACE FUNCTION get_categories_with_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  image_url TEXT,
  parent_id UUID,
  sort_order INTEGER,
  product_count INTEGER,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.image_url,
    c.parent_id,
    c.sort_order,
    COALESCE(pc.product_count, 0) as product_count,
    c.is_active
  FROM categories c
  LEFT JOIN (
    SELECT 
      category_id,
      COUNT(*) as product_count
    FROM products 
    WHERE status = 'active'
    GROUP BY category_id
  ) pc ON c.id = pc.category_id
  WHERE c.is_active = true
  ORDER BY c.sort_order, c.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get reviews for a product
CREATE OR REPLACE FUNCTION get_product_reviews(
  p_product_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_sort_by TEXT DEFAULT 'created_at',
  p_sort_order TEXT DEFAULT 'DESC'
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  reviewer_name TEXT,
  reviewer_email TEXT,
  title TEXT,
  body TEXT,
  rating INTEGER,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.user_id,
    r.reviewer_name,
    r.reviewer_email,
    r.title,
    r.body,
    r.rating,
    r.status,
    r.created_at,
    r.updated_at
  FROM reviews r
  WHERE r.product_id = p_product_id AND r.status = 'approved'
  ORDER BY 
    CASE WHEN p_sort_by = 'rating' AND p_sort_order = 'DESC' THEN r.rating END DESC,
    CASE WHEN p_sort_by = 'rating' AND p_sort_order = 'ASC' THEN r.rating END ASC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'DESC' THEN r.created_at END DESC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_order = 'ASC' THEN r.created_at END ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
