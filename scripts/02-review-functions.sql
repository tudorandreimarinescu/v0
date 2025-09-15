-- Additional review management functions

-- Function to create a new review (requires authentication)
CREATE OR REPLACE FUNCTION create_review(
  p_product_id UUID,
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_rating INTEGER
)
RETURNS TABLE (
  id UUID,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  review_id UUID;
  user_profile RECORD;
BEGIN
  -- Validate rating
  IF p_rating < 1 OR p_rating > 5 THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Rating must be between 1 and 5';
    RETURN;
  END IF;

  -- Get user profile
  SELECT * INTO user_profile FROM profiles WHERE id = p_user_id;
  
  IF user_profile IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'User profile not found';
    RETURN;
  END IF;

  -- Check if user has already reviewed this product
  IF EXISTS (SELECT 1 FROM reviews WHERE product_id = p_product_id AND user_id = p_user_id) THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'You have already reviewed this product';
    RETURN;
  END IF;

  -- Create the review
  INSERT INTO reviews (
    product_id,
    user_id,
    reviewer_name,
    reviewer_email,
    title,
    body,
    rating,
    status
  ) VALUES (
    p_product_id,
    p_user_id,
    COALESCE(user_profile.first_name || ' ' || user_profile.last_name, 'Anonymous'),
    user_profile.email,
    p_title,
    p_body,
    p_rating,
    'pending'
  ) RETURNING reviews.id INTO review_id;

  RETURN QUERY SELECT review_id, TRUE, 'Review submitted successfully and is pending moderation';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get review statistics for a product
CREATE OR REPLACE FUNCTION get_review_stats(p_product_id UUID)
RETURNS TABLE (
  total_reviews INTEGER,
  average_rating NUMERIC,
  rating_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_reviews,
    COALESCE(AVG(rating::NUMERIC), 0) as average_rating,
    jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    ) as rating_distribution
  FROM reviews 
  WHERE product_id = p_product_id AND status = 'approved';
END;
$$ LANGUAGE plpgsql;

-- Function to moderate reviews (admin only)
CREATE OR REPLACE FUNCTION moderate_review(
  p_review_id UUID,
  p_status TEXT,
  p_moderator_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  moderator_role TEXT;
BEGIN
  -- Check if moderator has admin role
  SELECT role INTO moderator_role FROM profiles WHERE id = p_moderator_id;
  
  IF moderator_role != 'admin' THEN
    RETURN QUERY SELECT FALSE, 'Insufficient permissions';
    RETURN;
  END IF;

  -- Validate status
  IF p_status NOT IN ('approved', 'rejected', 'pending') THEN
    RETURN QUERY SELECT FALSE, 'Invalid status';
    RETURN;
  END IF;

  -- Update review status
  UPDATE reviews 
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_review_id;

  IF FOUND THEN
    RETURN QUERY SELECT TRUE, 'Review status updated successfully';
  ELSE
    RETURN QUERY SELECT FALSE, 'Review not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can write a review (has purchased the product)
CREATE OR REPLACE FUNCTION can_user_review_product(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  has_purchased BOOLEAN := FALSE;
  has_reviewed BOOLEAN := FALSE;
BEGIN
  -- Check if user has purchased this product
  SELECT EXISTS (
    SELECT 1 
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = p_user_id 
    AND oi.product_id = p_product_id
    AND o.status = 'completed'
  ) INTO has_purchased;

  -- Check if user has already reviewed this product
  SELECT EXISTS (
    SELECT 1 FROM reviews 
    WHERE user_id = p_user_id AND product_id = p_product_id
  ) INTO has_reviewed;

  RETURN has_purchased AND NOT has_reviewed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
