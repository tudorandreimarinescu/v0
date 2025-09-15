-- Create foreign exchange rates table
CREATE TABLE IF NOT EXISTS fx_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(15,8) NOT NULL, -- High precision for exchange rates
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, effective_date)
);

-- Enable RLS
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fx_rates
CREATE POLICY "Public can view fx rates" ON fx_rates
  FOR SELECT USING (true); -- Exchange rates are public information

CREATE POLICY "Admins can manage fx rates" ON fx_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fx_rates_currencies ON fx_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_fx_rates_date ON fx_rates(effective_date);
