-- Setup RLS policies for fx_rates table (currency exchange rates)

-- Enable RLS on fx_rates table
ALTER TABLE public.fx_rates ENABLE ROW LEVEL SECURITY;

-- FX rates are publicly readable (needed for pricing calculations)
CREATE POLICY "fx_rates_public_select"
  ON public.fx_rates FOR SELECT
  USING (true);

-- Only admins can modify FX rates
CREATE POLICY "fx_rates_admin_all"
  ON public.fx_rates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
