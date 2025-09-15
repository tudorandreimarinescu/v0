-- Setup RLS policies for reviews table

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are publicly readable when approved
CREATE POLICY "reviews_public_select"
  ON public.reviews FOR SELECT
  USING (status = 'approved');

-- Users can create reviews
CREATE POLICY "reviews_user_insert"
  ON public.reviews FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND reviewer_email IS NOT NULL)
  );

-- Users can update their own reviews
CREATE POLICY "reviews_user_update_own"
  ON public.reviews FOR UPDATE
  USING (
    (auth.uid() = user_id) OR 
    (auth.jwt() ->> 'email' = reviewer_email)
  );

-- Admin policies for reviews
CREATE POLICY "reviews_admin_select_all"
  ON public.reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "reviews_admin_update_all"
  ON public.reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "reviews_admin_delete_all"
  ON public.reviews FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
